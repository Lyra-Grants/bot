export type TransferDto = {
  from: string
  to: string
  amount: number
  value: number
  transactionHash: string
  fromEns: string
  toEns: string
  timestamp: Date
  blockNumber: number
}
