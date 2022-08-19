/* eslint-disable no-var */

declare global {
  var LYRA_LEADERBOARD: trader[] = []
  var LYRA_ENS: { [key: string]: string } = {}
  var LYRA_PRICE: number
  var LYRA_24HR: number
  var ETH_PRICE: number
  var ETH_24HR: number
  var BTC_PRICE: number
  var BTC_24HR: number
}

export {}
