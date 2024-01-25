import sdk from '../api'
import { LiquidityRole, Trade } from '../types/api'
import { SendTweet } from '../integrations/twitter'
import { TradeDto } from '../types/trade'
import { TWITTER_THRESHOLD, TELEGRAM_THRESHOLD, DISCORD_THRESHOLD } from '../config'
import { toDate } from '../utils/utils'
import { PostTelegram } from '../integrations/telegram'
import { PostDiscord } from '../discord'
import { ActionRowBuilder, ButtonBuilder, Client } from 'discord.js'
import { TwitterApi } from 'twitter-api-v2'
import { Telegraf } from 'telegraf'
import { TradeDiscord, TradeTelegram, TradeTwitter } from '../templates/trade'
import { TRADE_CHANNEL } from '../constants/discordChannels'
import { ProviderType } from '../types/arbs'
import { ChainType } from '../types/chain'
import { MarketName } from '../types/market'
import { dateToYYYYMMDDHHMM } from '../utils/date'
import { mapStringToEnum } from '../utils/enumMapper'

export type EventListener = {
  off: () => void
}

export type EventListenerCallback = (trades: Trade[]) => void

export type EventListenerOptions = {
  pollInterval?: number
  startTime?: number
}

export async function RunTradeBot(discordClient: Client, twitterClient: TwitterApi, telegramClient: Telegraf) {
  TradeListener.on(async (trades) => {
    const tradeDtos = trades.map(async (trade) => {
      return mapToTradeDto(trade, 'LYRA')
    })

    const tradeObjects = await Promise.all(tradeDtos)
    tradeObjects.map(async (tradeDto) => {
      await BroadCastTrade(tradeDto, twitterClient, telegramClient, discordClient)
    })
  })
}

export class TradeListener {
  static on(callback: EventListenerCallback, options?: EventListenerOptions): EventListener {
    const ms = options?.pollInterval ?? 30 * 1000
    let startTime = options?.startTime ?? Math.floor(Date.now())
    let timeout: NodeJS.Timeout | null

    const poll = async () => {
      try {
        const toTime = Math.floor(Date.now())
        const fromTime = startTime

        console.debug(`POLLING FROM ${fromTime} TO ${toTime} `)
        const response = await sdk.postPublicGet_trade_history({
          from_timestamp: fromTime,
          instrument_type: 'option',
          page: 1,
          page_size: 100,
          to_timestamp: toTime,
          tx_status: 'settled',
        })

        const trades = (response.data.result.trades as Trade[]).filter((x) => x.liquidity_role == 'taker')
        //  console.log(trades)

        if (trades.length > 0) {
          console.debug(`Found ${trades.length} trades`)
          callback(trades)
        }

        startTime = toTime
      } catch (error) {
        console.error('Error in polling', error)
      }

      timeout = setTimeout(poll, ms)
    }

    timeout = setTimeout(poll, ms)

    return {
      off: () => {
        if (timeout) {
          clearTimeout(timeout)
        }
      },
    }
  }
}

function parseOptionString(optionString: string): {
  market: string
  expiryDate: Date
  strikePrice: number
  optionType: string
} {
  // Split the string by the '-' character
  const parts = optionString.split('-')

  if (parts.length !== 4) {
    throw new Error('Invalid option string format')
  }

  const market = parts[0]
  const expiryDateString = parts[1]
  const strikePrice = parseFloat(parts[2])
  const optionType = parts[3]

  // Convert expiryDateString into a Date object
  const year = parseInt(expiryDateString.substring(0, 4), 10)
  const month = parseInt(expiryDateString.substring(4, 6), 10) - 1 // month is 0-indexed in JavaScript Date
  const day = parseInt(expiryDateString.substring(6, 8), 10) + 1
  const expiryDate = new Date(year, month, day)

  // Validate the extracted values (additional validation can be added as needed)
  if (!market || !expiryDate || isNaN(strikePrice) || (optionType !== 'C' && optionType !== 'P')) {
    throw new Error('Invalid values extracted from option string')
  }

  return { market, expiryDate, strikePrice, optionType }
}

export async function mapToTradeDto(trade: Trade, network: string) {
  const parsed = parseOptionString(trade.instrument_name)
  const date = toDate(trade.timestamp)
  const utcDate = dateToYYYYMMDDHHMM(date)
  const expiryDate = parsed.expiryDate
  const utcExpiry = dateToYYYYMMDDHHMM(expiryDate)

  const tradeDto: TradeDto = {
    tradeKey: `${trade.trade_id}-${trade.liquidity_role}`,
    tradeId: trade.trade_id,
    instrument: trade.instrument_name,
    account: trade.wallet.toLowerCase(),
    market: mapStringToEnum(parsed.market, MarketName),
    isCall: parsed.optionType == 'C',
    isBuy: trade.direction == 'buy',
    strike: parsed.strikePrice,
    expiry: utcExpiry,
    expiryTimestamp: Math.floor(parsed.expiryDate.getTime()),
    size: Number(trade.trade_amount),
    transactionHash: trade.tx_hash,
    fee: Number(trade.trade_fee),
    optionPrice: Number(trade.trade_price),
    spot: Number(trade.index_price),
    provider: ProviderType.LYRA,
    timestamp: trade.timestamp,
    date: utcDate,
    chain: mapStringToEnum((network as string).toUpperCase(), ChainType),
    liquidityRole: mapStringToEnum(trade.liquidity_role.toUpperCase(), LiquidityRole),
    premium: Number(trade.trade_amount) * Number(trade.trade_price),
  }

  return tradeDto
}
export async function BroadCastTrade(
  trade: TradeDto,
  twitterClient: TwitterApi,
  telegramClient: Telegraf,
  discordClient: Client<boolean>,
): Promise<void> {
  if (trade.premium >= Number(TWITTER_THRESHOLD)) {
    await SendTweet(TradeTwitter(trade), twitterClient)
  }

  if (trade.premium >= Number(TELEGRAM_THRESHOLD)) {
    await PostTelegram(TradeTelegram(trade), telegramClient)
  }

  if (trade.premium >= Number(DISCORD_THRESHOLD)) {
    const embeds = [TradeDiscord(trade)]
    const rows: ActionRowBuilder<ButtonBuilder>[] = []
    await PostDiscord(embeds, rows, discordClient, TRADE_CHANNEL)
  }
}
