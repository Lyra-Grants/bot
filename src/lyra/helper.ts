import { Position, Trade } from '../graphql'
import { toNumber } from '../utils/utils'

export function GetProfit(trade: Trade): number {
  const netPremium = NetPremiums(trade.position.trades)
  const openOptionValue = OpenOptionValue(trade.position)
  const balance = netPremium + openOptionValue
  return balance
}

export function NetPremiums(trades: Trade[]): number {
  return trades.reduce((sum, trade) => {
    const premium = toNumber(trade.premium)
    // Buys pay premium, sells receive premium
    return sum + premium * (trade.isBuy ? -1 : 1)
  }, 0)
}

export function PremiumsPaid(trades: Trade[]) {
  return trades.reduce((sum, trade) => {
    const premium = trade.isBuy ? toNumber(trade.premium) : 0
    return sum + premium
  }, 0)
}

export function OpenOptionValue(position: Position): number {
  const size = toNumber(position.size)
  const latestOptionPrice = toNumber(position.option.latestOptionPriceAndGreeks.optionPrice)
  // Longs are sold for premium, shorts owe premium
  return size * latestOptionPrice * (position.isLong ? 1 : -1)
}
