export interface LyraApi {
  data: ApiData
}

export interface ApiData {
  result: Result
  id: string
}

export interface Result {
  trades: Trade[]
  pagination: Pagination
}

export interface Pagination {
  num_pages: number
  count: number
}

export interface Trade {
  trade_id: string
  instrument_name: InstrumentName
  timestamp: number
  trade_price: string
  trade_amount: string
  mark_price: string
  index_price: string
  direction: Direction
  wallet: string
  subaccount_id: number
  tx_status: TxStatus
  tx_hash: string
  trade_fee: string
  liquidity_role: LiquidityRole
}

export enum Direction {
  Buy = 'buy',
  Sell = 'sell',
}

export enum InstrumentName {
  EthPerp = 'ETH-PERP',
}

export enum LiquidityRole {
  Maker = 'maker',
  Taker = 'taker',
}

export enum TxStatus {
  Settled = 'settled',
}
