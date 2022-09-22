import { OptionType } from 'dayjs'
import { EventType } from '../constants/eventType'
import { Instrument } from './arbs'

export type BaseEvent = {
  eventType: EventType
}

export type BaseDto = {
  transactionHash: string
  timestamp: Date
  blockNumber: number
}

export type Arb = {
  apy: number
  discount: number
  term: string
  strike: number
  amount: number
  expiration: number
  type: OptionType
  buy: Instrument
  sell: Instrument
}

export type ArbDto = BaseEvent & {
  arbs: Arb[]
}

export type DepositDto = BaseDto & {
  from: string
  to: string
  amount: number
  value: number
  fromEns: string
  toEns: string
  notableTo: boolean
  notableFrom: boolean
  fromAddress: string
  toAddress: string
  totalQueued: number
  degenMessage: string
  market: string
}

export type TradeDto = BaseDto & {
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
  ens: string
  leaderBoard: Trader
  pnl: number
  pnlPercent: number
  totalPremiumPaid: number
  isProfitable: boolean
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
  fee: number
  optionPrice: number
  spot: number
  degenMessage: string
}

export type LyraDto = BaseEvent & {
  price: number
  marketCap: number
  totalSupply: number
  marketCapRank: number
  tvl: number
  fdv: number
  price_24h: number
  fdv_tvl_ratio: number
  mc_tvl_ratio: number
  circSupply: number
  maxSupply: number
}

export type StatDto = {
  asset: string
  tvl: number
  tvlChange: number
  tokenPrice: number
  pnlChange: number
  openInterestUsd: number
  openInterestBase: number
  netDelta: number
  netStdVega: number
  tradingVolume: number
  tradingFees: number
  timestamp: Date
  utilisationRate: number
}

export type Trader = {
  owner: string
  balance: number
  netPremiums: number
  openOptionsValue: number
  isProfitable: boolean
  ens: string
  position: number
  netPremiumsFormatted: string
  openOptionsFormatted: string
}

export type TransferDto = BaseDto & {
  from: string
  to: string
  amount: number
  value: number
  fromEns: string
  toEns: string
  notableTo: boolean
  notableFrom: boolean
  fromAddress: string
  toAddress: string
}