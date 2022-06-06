import Lyra, { Position } from '@lyrafinance/lyra-js'
import { SendTweet } from '../integrations/twitter'
import { TradeDto } from '../types/tradeDto'
import {
  DISCORD_ENABLED,
  TELEGRAM_ENABLED,
  TWITTER_ENABLED,
  TWITTER_THRESHOLD,
  TELEGRAM_THRESHOLD,
  DISCORD_THRESHOLD,
  TESTNET,
} from '../utils/secrets'
import { dollar, signed, toDate } from '../utils/utils'
import { TradeEvent } from '@lyrafinance/lyra-js'
import { MapLeaderBoard } from './leaderboard'
import { GetEns } from '../integrations/ens'
import { PostTelegram } from '../integrations/telegram'
import { activityString, defaultActivity, PostDiscord } from '../integrations/discord'
import { Client } from 'discord.js'
import { TwitterApi } from 'twitter-api-v2'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TradeDiscord, TradeTelegram, TradeTwitter } from '../utils/template'
import fromBigNumber from '../utils/fromBigNumber'

export async function RunTradeBot(
  discordClient: Client<boolean>,
  twitterClient: TwitterApi,
  telegramClient: Telegraf<Context<Update>>,
  lyraClient: Lyra,
) {
  console.log('### Polling for Trades ###')

  let blockNumber: number | undefined = undefined

  if (TESTNET) {
    blockNumber = lyraClient.provider.blockNumber - 5000
  }
  // const trade = (
  //   await TradeEvent.getByHash(lyraClient, '0x92548b3217179539b62f042bff95e92cdb6fccf02991789b5b71f763a7d76d44')
  // )[0]
  // const tradeDto = await MapToTradeDto(trade)
  // await BroadCastTrade(tradeDto, twitterClient, telegramClient, discordClient)

  lyraClient.onTrade(
    async (trade) => {
      try {
        const tradeDto = await MapToTradeDto(trade)
        await BroadCastTrade(tradeDto, twitterClient, telegramClient, discordClient)
      } catch (e: any) {
        console.log(e)
      }
    },
    { startBlockNumber: blockNumber },
  )
}
export async function MapToTradeDto(trade: TradeEvent): Promise<TradeDto> {
  const position = await trade.position()
  const pnl = fromBigNumber(await trade.realizedPnl())
  const pnlPercent = fromBigNumber(await trade.realizedPnlPercent(), 16)
  const trades = position.trades()
  const totalPremiumPaid = PremiumsPaid(trades)
  const market = await trade.market()
  const noTrades = trades.length

  const tradeDto: TradeDto = {
    asset: market.name,
    isLong: trade.isLong,
    isCall: trade.isCall,
    isBuy: trade.isBuy,
    strike: fromBigNumber(trade.strikePrice),
    expiry: toDate(trade.expiryTimestamp),
    size: fromBigNumber(trade.size),
    premium: fromBigNumber(trade.premium),
    trader: trade.trader,
    transactionHash: trade.transactionHash,
    isOpen: trade.isOpen,
    ens: await GetEns(trade.trader),
    leaderBoard: MapLeaderBoard(global.LYRA_LEADERBOARD, trade.trader),
    pnl: pnl,
    pnlPercent: pnlPercent,
    totalPremiumPaid: totalPremiumPaid,
    isProfitable: pnl > 0,
    timeStamp: toDate(trade.timestamp),
    positionId: trade.positionId,
    positionTradeCount: noTrades,
    pnlFormatted: dollar(pnl),
    pnlPercentFormatted: `(${signed(pnlPercent)}%)`,
    isLiquidation: trade.isLiquidation,
    setCollateralTo: trade.setCollateralTo ? fromBigNumber(trade.setCollateralTo) : undefined,
    pricePerOption: fromBigNumber(trade.pricePerOption),
    lpFees: trade.liquidation ? fromBigNumber(trade.liquidation.lpFee) : undefined,
    premiumFormatted: dollar(
      AmountWording(fromBigNumber(trade.premium), trade.isLong, trade.isOpen, trade.isLiquidation),
    ),
    isBaseCollateral: trade.isBaseCollateral,
    baseCollateralFormatted: BaseCollateral(trade, market.name),
  }
  return tradeDto
}

export function AmountWording(amount: number, isLong: boolean, isOpen: boolean, isLiquidation: boolean): number {
  if (isLiquidation) {
    return amount * -1
  }

  if (isOpen) {
    return isLong ? amount * -1 : amount
  }

  return isLong ? amount : amount * -1
}

export function BaseCollateral(trade: TradeEvent, asset: string) {
  const setCollateralTo = trade.setCollateralTo ? fromBigNumber(trade.setCollateralTo) : undefined

  if (setCollateralTo == undefined) {
    return ''
  }

  if (!trade.isBaseCollateral) {
    return `$${setCollateralTo?.toFixed(2)}`
  }

  return `${setCollateralTo?.toFixed(2)} ${asset}`
}

export async function BroadCastTrade(
  trade: TradeDto,
  twitterClient: TwitterApi,
  telegramClient: Telegraf<Context<Update>>,
  discordClient: Client<boolean>,
): Promise<void> {
  // Twitter //
  if (trade.premium >= TWITTER_THRESHOLD && TWITTER_ENABLED) {
    const post = TradeTwitter(trade)
    await SendTweet(post, twitterClient)
  }

  // Telegram //
  if (trade.premium >= TELEGRAM_THRESHOLD && TELEGRAM_ENABLED) {
    const post = TradeTelegram(trade)
    await PostTelegram(post, telegramClient)
  }

  // Discord //
  if (trade.premium >= DISCORD_THRESHOLD && DISCORD_ENABLED) {
    const post = [TradeDiscord(trade)]
    const channelName = TESTNET ? 'kovan-trades' : 'avalon-trades'
    await PostDiscord(post, discordClient, channelName)
    discordClient?.user?.setActivity(activityString(trade), { type: 'WATCHING' })

    const waitFor = (delay: number, client: Client<boolean>) =>
      new Promise(() =>
        setTimeout(() => {
          defaultActivity(client)
        }, delay),
      )

    await waitFor(60000, discordClient)
  }
}

export function PremiumsPaid(trades: TradeEvent[]) {
  return trades.reduce((sum, trade) => {
    const premium = trade.isBuy ? fromBigNumber(trade.premium) : 0
    return sum + premium
  }, 0)
}
