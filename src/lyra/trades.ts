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
} from '../utils/secrets'
import { toDate, toNumber, toWholeNumber } from '../utils/utils'
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

export async function RunTradeBot(
  discordClient: Client<boolean>,
  twitterClient: TwitterApi,
  telegramClient: Telegraf<Context<Update>>,
  lyraClient: Lyra,
) {
  console.log('### Polling for Trades ###')

  lyraClient.onTrade(async (trade) => {
    try {
      const tradeDto = await MapToTradeDto(trade)
      await BroadCastTrade(tradeDto, twitterClient, telegramClient, discordClient)
    } catch (e: any) {
      console.log(e)
    }
  })
}

export async function MapToTradeDto(trade: TradeEvent): Promise<TradeDto> {
  const position = await trade.position()
  const pnl = toNumber(position.pnl())
  const trades = position.trades()
  const totalPremiumPaid = PremiumsPaid(trades)
  const pnlNoNeg = pnl > 0 ? pnl : pnl * -1
  const market = await trade.market()
  const noTrades = position.trades().length

  const tradeDto: TradeDto = {
    asset: market.name,
    isLong: trade.isLong,
    isCall: trade.isCall,
    isBuy: trade.isBuy,
    strike: toNumber(trade.strikePrice),
    expiry: toDate(trade.expiryTimestamp),
    size: toNumber(trade.size),
    premium: toWholeNumber(trade.premium),
    trader: trade.trader,
    transactionHash: trade.transactionHash,
    isOpen: trade.isOpen,
    ens: await GetEns(trade.trader),
    leaderBoard: MapLeaderBoard(global.LYRA_LEADERBOARD, trade.trader),
    pnl: Math.floor(pnlNoNeg),
    pnlPercent: toNumber(position.pnlPercent()),
    totalPremiumPaid: totalPremiumPaid,
    isProfitable: pnl > 0,
    timeStamp: toDate(trade.timestamp),
    positionId: trade.positionId,
    positionTradeCount: noTrades,
  }
  return tradeDto
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
    await PostDiscord(post, discordClient)
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
    const premium = trade.isBuy ? toNumber(trade.premium) : 0
    return sum + premium
  }, 0)
}
