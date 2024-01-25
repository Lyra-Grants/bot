import { OptionType } from 'dayjs'
import { EventType } from '../constants/eventType'
import { Instrument, ProviderType } from './arbs'
import { Fren } from './fren'
import { LiquidityRole } from './api'
import { MarketName } from './market'
import { ChainType } from './chain'

export type BaseEvent = {
  eventType: EventType
}

export type BaseDto = {
  transactionHash: string
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
    asset: string
  }

export type TraderAddress = {
  ens: string
  notableAddress: string
  isNotable: boolean
  account: string
  url: string
}

export type TradeDto = BaseDto & {
  tradeId: string
  instrument: string
  account: string
  market: MarketName | undefined
  isCall: boolean
  isBuy: boolean
  strike: number
  expiryTimestamp: number
  expiry: string
  size: number
  fee: number
  optionPrice: number
  spot: number
  date: string
  provider: ProviderType
  timestamp: number
  chain: ChainType | undefined
  liquidityRole: LiquidityRole | undefined
  premium: number
  tradeKey: string
}

export type TradeParams = {
  market: MarketName | undefined
  timestamp: number | undefined
  chain: ChainType | undefined
  account: string | undefined
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
  token: string
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
  asset: string
}
