export type trader = {
  owner: string
  balance: number
  netPremiums: number
  openOptionsValue: number
  isProfitable: boolean
}

export type indexedTrader = trader & {
  index: number
}
