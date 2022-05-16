import Lyra from '@lyrafinance/lyra-js'
import { SendTweet } from '../integrations/twitter'
import { TradeDto } from '../types/tradeDto'
import {
  DISCORD_ACCESS_TOKEN,
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
import { PostDiscord } from '../integrations/discord'
import { Client } from 'discord.js'
import { DiscordClient } from '../clients/discordClient'
import { TwitterClient } from '../clients/twitterClient'
import { TwitterApi } from 'twitter-api-v2'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TelegramClient } from '../clients/telegramClient'

let discordClient: Client<boolean>
let twitterClient: TwitterApi
let telegramClient: Telegraf<Context<Update>>

export async function RunTradeBot() {
  console.log('### Polling for Trades ###')
  const lyra = new Lyra()
  SetUpDiscord()
  SetUpTwitter()
  SetUpTelegram()

  lyra.onTrade(async (trade) => {
    try {
      const tradeDto = await MapToTradeDto(trade)
      await BroadCastTrade(tradeDto)
    } catch (e: any) {
      console.log(e)
    }
  })
}

export async function SetUpDiscord() {
  if (DISCORD_ENABLED) {
    discordClient = DiscordClient
    discordClient.on('ready', async (client) => {
      console.log('Discord bot is online!')
    })

    await discordClient.login(DISCORD_ACCESS_TOKEN)
    discordClient.user?.setActivity('Avalon Trades', { type: 'WATCHING' })
  }
}

export async function SetUpTwitter() {
  if (TWITTER_ENABLED) {
    twitterClient = TwitterClient
    twitterClient.readWrite
  }
}

export async function SetUpTelegram() {
  if (TELEGRAM_ENABLED) {
    telegramClient = TelegramClient
  }
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

export async function BroadCastTrade(trade: TradeDto): Promise<void> {
  // Twitter //
  if (trade.premium >= TWITTER_THRESHOLD && TWITTER_ENABLED) {
    await SendTweet(trade, twitterClient)
  }

  // Telegram //
  if (trade.premium >= TELEGRAM_THRESHOLD && TELEGRAM_ENABLED) {
    await PostTelegram(trade, telegramClient)
  }

  // Discord //
  if (trade.premium >= DISCORD_THRESHOLD && DISCORD_ENABLED) {
    await PostDiscord(trade, discordClient)
  }
}

export function PremiumsPaid(trades: TradeEvent[]) {
  return trades.reduce((sum, trade) => {
    const premium = trade.isBuy ? toNumber(trade.premium) : 0
    return sum + premium
  }, 0)
}
