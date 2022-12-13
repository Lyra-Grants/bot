import { Client } from 'discord.js'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TwitterApi } from 'twitter-api-v2'
import { PostDiscord } from '../integrations/discord'
import { SendTweet } from '../integrations/twitter'
import { GetEns } from '../integrations/ens'
import { Trader } from '../types/lyra'
import { DISCORD_ENABLED, TELEGRAM_ENABLED, TESTNET, TWITTER_ENABLED } from '../secrets'
import { PostTelegram } from '../integrations/telegram'
import { LeaderboardDiscord, LeaderboardTwitter, LeaderboardTelegram } from '../templates/leaderboard'
import { TRADE_CHANNEL } from '../constants/discordChannels'
import Lyra, { PositionLeaderboard, PositionLeaderboardSortBy } from '@lyrafinance/lyra-js'
import { ONE_BN } from '../constants/bn'
import { GetNotableAddress } from '../utils/notableAddresses'
import fromBigNumber from '../utils/fromBigNumber'
import { GetUrl } from '../utils/utils'
import { GetFren } from '../integrations/fren'
import moment from 'moment'

// async function GetLeaderBoardTrades(): Promise<Trade[]> {
//   const trades = (
//     await apolloClient.query<{ trades: Trade[] }>({
//       query: leaderboardTradesQuery(),
//     })
//   ).data.trades
//   return trades
// }

// async function GetLeaderBoardPositions(): Promise<Position[]> {
//   const positions = (
//     await apolloClient.query<{ positions: Position[] }>({
//       query: positionsQuery(),
//     })
//   ).data.positions
//   return positions
// }

// export async function GetLeaderBoard(take: number) {
//   const trades = await GetLeaderBoardTrades()
//   const positions = await GetLeaderBoardPositions()
//   const owners = Array.from(new Set(Object.values(trades).map((val) => <string>val.trader.toLowerCase())))

//   const traders = owners
//     .map((owner) => {
//       const userTrades = trades.filter((trade) => trade.trader.toLowerCase() === owner)
//       const netPremiums = NetPremiums(userTrades)
//       const userPositions = positions.filter((position) => position.owner.toLowerCase() === owner)
//       const openOptionsValue = userPositions.reduce((sum, position) => {
//         const optionValue = OpenOptionValue(position)
//         return sum + optionValue
//       }, 0)
//       const balance = netPremiums + openOptionsValue
//       const trader: Trader = {
//         owner: owner,
//         balance: balance,
//         netPremiums: netPremiums,
//         openOptionsValue: openOptionsValue,
//         isProfitable: balance > 0,
//         ens: '',
//         position: 0,
//         netPremiumsFormatted: dollar(netPremiums),
//         openOptionsFormatted: openOptionsValue == 0 ? '' : `(${dollar(openOptionsValue)})`,
//       }
//       return trader
//     })
//     .sort((a, b) => b.netPremiums - a.netPremiums)
//     .slice(0, take)

//   await Promise.all(
//     traders.map(async (trader, index) => {
//       trader.ens = await GetEns(trader.owner)
//       trader.position = index + 1
//     }),
//   )

//   return traders
// }

export async function FindOnLeaderBoard(traderAddress: string): Promise<Trader> {
  const EMPTY: Trader = {
    account: '',
    realizedPnl: 0,
    unrealizedPnl: 0,
    realizedLongPnl: 0,
    realizedLongPnlPercentage: 0,
    unrealizedLongPnl: 0,
    unrealizedLongPnlPercentage: 0,
    totalPremiums: 0,
    totalLongPremiums: 0,
    totalNotionalVolume: 0,
    isProfitable: false,
    ens: '',
    position: 0,
    isNotable: false,
    notableAddress: '',
    url: '',
    fren: undefined,
  }

  const index = LYRA_LEADERBOARD.findIndex(
    (leaderboard) => leaderboard.account.toLowerCase() === traderAddress.toLowerCase(),
  )

  if (index === -1) {
    console.log('Trader not on leaderboard')
    return EMPTY
  }

  const trader = await ParsePositionLeaderboard(LYRA_LEADERBOARD[index], index + 1)
  return trader
}

export async function ParsePositionLeaderboard(positionLeaderBoard: PositionLeaderboard, position: number) {
  const notableAddress = GetNotableAddress(positionLeaderBoard.account.toLowerCase())
  const isNotable = notableAddress != ''
  const ens = await GetEns(positionLeaderBoard.account)

  const result: Trader = {
    account: positionLeaderBoard.account.toLowerCase(),
    realizedPnl: fromBigNumber(positionLeaderBoard.realizedPnl),
    unrealizedPnl: fromBigNumber(positionLeaderBoard.unrealizedPnl),
    realizedLongPnl: fromBigNumber(positionLeaderBoard.realizedLongPnl),
    realizedLongPnlPercentage: fromBigNumber(positionLeaderBoard.realizedLongPnlPercentage),
    unrealizedLongPnl: fromBigNumber(positionLeaderBoard.unrealizedLongPnl),
    unrealizedLongPnlPercentage: fromBigNumber(positionLeaderBoard.unrealizedLongPnlPercentage),
    totalPremiums: fromBigNumber(positionLeaderBoard.totalPremiums),
    totalLongPremiums: fromBigNumber(positionLeaderBoard.totalLongPremiums),
    totalNotionalVolume: fromBigNumber(positionLeaderBoard.totalNotionalVolume),
    isProfitable: fromBigNumber(positionLeaderBoard.realizedPnl) > 0,
    ens: await GetEns(positionLeaderBoard.account),
    position: position,
    notableAddress: notableAddress,
    isNotable: isNotable,
    url: GetUrl(positionLeaderBoard.account.toLowerCase(), isNotable),
    fren: await GetFren(ens),
  }

  return result
}

export async function GetLeaderBoard(lyra: Lyra) {
  const monthAgo = moment().subtract(14, 'days').unix()
  LYRA_LEADERBOARD = await lyra.leaderboard({
    minOpenTimestamp: monthAgo,
    sortBy: PositionLeaderboardSortBy.RealizedPnl,
    secondarySortBy: PositionLeaderboardSortBy.UnrealizedPnl,
    minTotalPremiums: ONE_BN.mul(100),
  })
  console.log(LYRA_LEADERBOARD)
}

export async function BroadcastLeaderBoard(
  discordClient: Client<boolean>,
  twitterClient: TwitterApi,
  telegramClient: Telegraf<Context<Update>>,
) {
  console.log('### Broadcast Leaderboard ###')

  const traders = await Promise.all(
    global.LYRA_LEADERBOARD.slice(0, 10).map(async (x, index) => await ParsePositionLeaderboard(x, index + 1)),
  )

  if (DISCORD_ENABLED) {
    const channelName = TRADE_CHANNEL

    const embeds = LeaderboardDiscord(traders.slice(0, 10))
    await PostDiscord(embeds, discordClient, channelName)
  }

  if (TWITTER_ENABLED) {
    const post = LeaderboardTwitter(traders.slice(0, 5))
    await SendTweet(post, twitterClient)
  }

  if (TELEGRAM_ENABLED) {
    const post = LeaderboardTelegram(traders.slice(0, 10))
    await PostTelegram(post, telegramClient)
  }
}
