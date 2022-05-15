import Lyra from '@lyrafinance/lyra-js'
import { SendTweet } from '../integrations/twitter'
import { TradeDto } from '../types/tradeDto'
import { PREMIUM_THRESHOLD } from '../utils/secrets'
import { toDate, toNumber, toWholeNumber } from '../utils/utils'
import { TradeEvent } from '@lyrafinance/lyra-js'
import { MapLeaderBoard } from './leaderboard'
import { GetEns } from '../integrations/ens'
import { PostTelegram } from '../integrations/telegram'
import { PostDiscord } from '../integrations/discord'

export async function RunTradeBot() {
  console.log('### Polling for Trades ###')
  const lyra = new Lyra()

  lyra.onTrade(async (trade) => {
    try {
      const tradeDto = await MapToTradeDto(trade)
      if (tradeDto.premium > PREMIUM_THRESHOLD) {
        await BroadCastTrade(tradeDto)
      } else {
        console.log('Trade Less Than Threshold')
      }
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

export async function BroadCastTrade(trade: TradeDto): Promise<void> {
  // Twitter //
  await SendTweet(trade)

  // Telegram //
  await PostTelegram(trade)

  // Discord //
  await PostDiscord(trade)
}

export function PremiumsPaid(trades: TradeEvent[]) {
  return trades.reduce((sum, trade) => {
    const premium = trade.isBuy ? toNumber(trade.premium) : 0
    return sum + premium
  }, 0)
}
