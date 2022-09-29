/* eslint-disable no-var */

declare global {
  var LYRA_LEADERBOARD: Trader[] = []
  var LYRA_ENS: { [key: string]: string } = {}
  var LYRA_PRICE: number
  var LYRA_24HR: number
  var ETH_PRICE: number
  var ETH_24HR: number
  var BTC_PRICE: number
  var BTC_24HR: number
  var SOL_PRICE: number
  var SOL_24HR: number
}

declare module '*.json' {
  const value: any
  export default value
}

export {}
