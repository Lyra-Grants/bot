import { OptionType } from 'dayjs'
import { EventType } from '../constants/eventType'
import { Instrument } from './arbs'
import { Fren } from './fren'

export type BaseEvent = {
  eventType: EventType
}

export type BaseDto = {
  transactionHash: string
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
  market: string
}

export type DepositDto = BaseDto &
  TraderAddress & {
    to: string
    amount: number
    value: number
    notableTo: boolean
    fromAddress: string
    toAddress: string
    totalQueued: number
    market: string
  }

export type TraderAddress = {
  ens: string
  notableAddress: string
  isNotable: boolean
  account: string
  url: string
}

export type TradeDto = BaseDto &
  TraderAddress & {
    asset: string
    isOpen: boolean
    isLong: boolean
    isCall: boolean
    isBuy: boolean
    strike: number
    expiry: Date
    size: number
    premium: number
    leaderBoard: Trader
    pnl: number
    pnlPercent: number
    unrealizedPnl: number
    unrealizedPnlPercent: number
    totalPremiumPaid: number
    isProfitable: boolean
    positionId: number
    positionTradeCount: number
    pnlFormatted: string
    pnlPercentFormatted: string
    unrealizedPnlFormatted: string
    unrealizedPnlPercentFormatted: string
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
    fren: Fren | undefined
    url: string
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

export type Trader = TraderAddress & {
  longPnl: number
  shortPnl: number
  longPnlPercentage: number
  shortPnlPercentage: number
  realizedPnl: number
  unrealizedPnl: number
  unrealizedPnlPercentage: number
  initialCostOfOpen: number
  isProfitable: boolean
  position: number
  fren: Fren | undefined
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

export type StrikeDto = {
  strikeId: number
  strikePrice: number
  skew: number
}

export type BoardDto = BaseDto & {
  expiry: Date
  strikes: StrikeDto[]
  market: string
  expiryString: string
}
