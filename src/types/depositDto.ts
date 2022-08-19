export type DepositDto = {
  from: string
  to: string
  amount: number
  value: number
  transactionHash: string
  fromEns: string
  toEns: string
  timestamp: Date
  blockNumber: number
  notableTo: boolean
  notableFrom: boolean
  fromAddress: string
  toAddress: string
  totalQueued: number
  degenMessage: string
  market: string
}
