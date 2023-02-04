import { Position, Trade } from '../graphql'
import fromBigNumber from '../utils/fromBigNumber'

export function GetProfit(trade: Trade): number {
  const netPremium = NetPremiums(trade.position.trades)
  const openOptionValue = OpenOptionValue(trade.position)
  const balance = netPremium + openOptionValue
  return balance
}

export function NetPremiums(trades: Trade[]): number {
  return trades.reduce((sum, trade) => {
    const premium = fromBigNumber(trade.premium)
    // Buys pay premium, sells receive premium
    return sum + premium * (trade.isBuy ? -1 : 1)
  }, 0)
}

export function PremiumsPaid(trades: Trade[]) {
  return trades.reduce((sum, trade) => {
    const premium = trade.isBuy ? fromBigNumber(trade.premium) : 0
    return sum + premium
  }, 0)
}

export function OpenOptionValue(position: Position): number {
  const size = fromBigNumber(position.size)
  const latestOptionPrice = fromBigNumber(position.option.latestOptionPriceAndGreeks.optionPrice)
  // Longs are sold for premium, shorts owe premium
  return size * latestOptionPrice * (position.isLong ? 1 : -1)
}
