import { indexedTrader, trader } from './trader'

export type TradeDto = {
  asset: string
  isOpen: boolean
  isLong: boolean
  isCall: boolean
  isBuy: boolean
  strike: number
  expiry: Date
  size: number
  premium: number
  trader: string
  transactionHash: string
  ens: string
  leaderBoard: indexedTrader
  pnl: number
  pnlPercent: number
  totalPremiumPaid: number
  isProfitable: boolean
}
