import { trader } from './trader'

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
  leaderBoard: trader
  pnl: number
  pnlPercent: number
  totalPremiumPaid: number
  isProfitable: boolean
  timeStamp: Date
  positionId: number
  positionTradeCount: number
  pnlFormatted: string
  pnlPercentFormatted: string
  isLiquidation: boolean
  lpFees: number | undefined
  setCollateralTo: number | undefined
  pricePerOption: number
  premiumFormatted: string
  isBaseCollateral: boolean | undefined
  baseCollateralFormatted: string
  iv: number
}
