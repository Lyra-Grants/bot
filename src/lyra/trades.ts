import Lyra from '@lyrafinance/lyra-js'
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
  QUANT_TRADE_THRESHOLD,
} from '../secrets'
import { dollar, signed, toDate } from '../utils/utils'
import { TradeEvent } from '@lyrafinance/lyra-js'
import { MapLeaderBoard } from './leaderboard'
import { GetEns } from '../integrations/ens'
import { PostTelegram } from '../integrations/telegram'
import { PostDiscord } from '../integrations/discord'
import { Client } from 'discord.js'
import { TwitterApi } from 'twitter-api-v2'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TradeDiscord, TradeTelegram, TradeTwitter } from '../templates/trade'
import fromBigNumber from '../utils/fromBigNumber'
import { RandomDegen } from '../constants/degenMessage'

export async function RunTradeBot(
  discordClient: Client<boolean>,
  discordClientBtc: Client<boolean>,
  twitterClient: TwitterApi,
  telegramClient: Telegraf<Context<Update>>,
  lyraClient: Lyra,
  quantClient: TwitterApi,
) {
  console.log('### Polling for Trades ###')

  let blockNumber: number | undefined = undefined
  if (TESTNET) {
    blockNumber = lyraClient.provider.blockNumber - 10000
  }

  lyraClient.onTrade(
    async (trade) => {
      try {
        const tradeDto = await MapToTradeDto(trade)
        await BroadCastTrade(tradeDto, twitterClient, telegramClient, discordClient, discordClientBtc, quantClient)
      } catch (e: any) {
        console.log(e)
      }
    },
    { startBlockNumber: blockNumber, pollInterval: 30000 },
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
  const ens = await GetEns(trade.trader)

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
    ens: ens,
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
    iv: fromBigNumber(trade.iv) * 100,
    fee: fromBigNumber(trade.fee),
    optionPrice: fromBigNumber(trade.pricePerOption),
    spot: fromBigNumber(trade.spotPrice),
    degenMessage: RandomDegen(),
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
  discordClientBtc: Client<boolean>,
  quantClient: TwitterApi,
): Promise<void> {
  // Twitter //
  if (TWITTER_ENABLED) {
    if (trade.premium >= TWITTER_THRESHOLD) {
      const tweet = TradeTwitter(trade, false)
      await SendTweet(tweet, twitterClient)
    }
    // if (trade.premium >= QUANT_TRADE_THRESHOLD || trade.isLiquidation || (trade.pnlPercent > 400 && trade.pnl > 500)) {
    //   console.log(`$${trade.premium} big! > $${QUANT_TRADE_THRESHOLD}`)
    //   const quantTweet = TradeTwitter(trade, true)
    //   console.log(quantTweet)
    //   await SendTweet(quantTweet, quantClient)
    // } else {
    //   console.log(`$${trade.premium} less than quant threshold: $${QUANT_TRADE_THRESHOLD}`)
    // }
  }

  // Telegram //
  if (trade.premium >= TELEGRAM_THRESHOLD && TELEGRAM_ENABLED) {
    const post = TradeTelegram(trade)
    await PostTelegram(post, telegramClient)
  }

  // Discord //
  if (trade.premium >= DISCORD_THRESHOLD && DISCORD_ENABLED) {
    const post = [TradeDiscord(trade)]
    const channelName = TESTNET ? 'kovan-trades' : '📥trades'

    if (trade.asset === 'ETH') {
      await PostDiscord(post, discordClient, channelName)
    } else {
      await PostDiscord(post, discordClientBtc, channelName)
    }
    //discordClient?.user?.setActivity(activityString(trade), { type: 'WATCHING' })

    // const waitFor = (delay: number, client: Client<boolean>) =>
    //   new Promise(() =>
    //     setTimeout(() => {
    //       defaultActivity(client)
    //     }, delay),
    //   )

    // await waitFor(60000, discordClient)
  }
}

export function PremiumsPaid(trades: TradeEvent[]) {
  return trades.reduce((sum, trade) => {
    const premium = trade.isBuy ? fromBigNumber(trade.premium) : 0
    return sum + premium
  }, 0)
}
