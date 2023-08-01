import { ActionRowBuilder, ButtonBuilder, Client } from 'discord.js'
import { Telegraf } from 'telegraf'
import { TwitterApi } from 'twitter-api-v2'
import { PostDiscord } from '../discord'
import { SendTweet } from '../integrations/twitter'
import { GetEns } from '../integrations/ens'
import { Trader } from '../types/lyra'
import { PostTelegram } from '../integrations/telegram'
import { LeaderboardDiscord, LeaderboardTwitter, LeaderboardTelegram } from '../templates/leaderboard'
import { TRADE_CHANNEL } from '../constants/discordChannels'
import { Network } from '@lyrafinance/lyra-js'
import { GetNotableAddress } from '../utils/notableAddresses'
import { GetUrl } from '../utils/utils'
import { GetFren } from '../integrations/fren'
import { GetLeaderboardAPI } from '../integrations/leaderboard'
import { LeaderboardElement } from '../types/leaderboardAPI'

export async function GetLeaderBoard(network: Network) {
  if (network == Network.Arbitrum) {
    return LEADERBOARD_ARB
  }
  return LEADERBOARD_OPT
}

export async function FindOnLeaderBoard(traderAddress: string, network: Network): Promise<Trader> {
  const EMPTY: Trader = {
    account: '',
    longPnl: 0,
    shortPnl: 0,
    longPnlPercentage: 0,
    shortPnlPercentage: 0,
    realizedPnl: 0,
    unrealizedPnl: 0,
    unrealizedPnlPercentage: 0,
    initialCostOfOpen: 0,
    isProfitable: false,
    ens: '',
    position: 0,
    isNotable: false,
    notableAddress: '',
    url: '',
    fren: undefined,
  }

  const leaderBoardData = await GetLeaderBoard(network)

  const index = leaderBoardData.findIndex(
    (leaderboard) => leaderboard.owner.toLowerCase() === traderAddress.toLowerCase(),
  )

  if (index === -1) {
    console.log(`Trader not on ${network} leaderboard`)
    return EMPTY
  }

  const trader = await ParsePositionLeaderboard(leaderBoardData[index], index + 1)
  return trader
}

export async function ParsePositionLeaderboard(positionLeaderBoard: LeaderboardElement, position: number) {
  const notableAddress = GetNotableAddress(positionLeaderBoard.owner.toLowerCase())
  const isNotable = notableAddress != ''
  const ens = await GetEns(positionLeaderBoard.owner)

  const result: Trader = {
    account: positionLeaderBoard.owner.toLowerCase(),
    longPnl: positionLeaderBoard.long_pnl,
    shortPnl: positionLeaderBoard.short_pnl,
    longPnlPercentage: positionLeaderBoard.long_pnl_percent,
    shortPnlPercentage: positionLeaderBoard.short_pnl_percent,
    realizedPnl: positionLeaderBoard.realized_pnl,
    unrealizedPnl: positionLeaderBoard.unrealized_pnl,
    unrealizedPnlPercentage: positionLeaderBoard.unrealized_pnl_percent,
    initialCostOfOpen: positionLeaderBoard.initial_cost_of_open,
    isProfitable: positionLeaderBoard.realized_pnl > 0,
    ens: await GetEns(positionLeaderBoard.owner),
    position: position,
    notableAddress: notableAddress,
    isNotable: isNotable,
    url: GetUrl(positionLeaderBoard.owner.toLowerCase(), isNotable),
    fren: await GetFren(ens),
  }

  return result
}

export async function FetchLeaderBoard() {
  await GetLeaderboardAPI()
}

export async function BroadcastLeaderBoard(
  discordClient: Client<boolean>,
  twitterClient: TwitterApi,
  telegramClient: Telegraf,
  network: Network,
) {
  console.log('### Broadcast Leaderboard ###')

  const leaderBoard = await GetLeaderBoard(network)

  const traders = await Promise.all(
    leaderBoard.slice(0, 10).map(async (x, index) => await ParsePositionLeaderboard(x, index + 1)),
  )

  const channelName = TRADE_CHANNEL
  const embeds = LeaderboardDiscord(traders.slice(0, 10), network)
  const rows: ActionRowBuilder<ButtonBuilder>[] = []
  await PostDiscord(embeds, rows, discordClient, channelName)

  const twitterPost = LeaderboardTwitter(traders.slice(0, 5))
  await SendTweet(twitterPost, twitterClient)

  const post = LeaderboardTelegram(traders.slice(0, 10))
  await PostTelegram(post, telegramClient)
}
