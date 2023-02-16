/* eslint-disable no-var */

import Lyra from '@lyrafinance/lyra-js'
import { Fren } from './fren'
import { LeaderboardElement } from './leaderboardAPI'

declare global {
  var LEADERBOARD_ARB: LeaderboardElement[] = []
  var LEADERBOARD_OPT: LeaderboardElement[] = []
  var LYRA_ENS: { [key: string]: string } = {}
  var FREN: { [key: string]: Fren } = {}

  var LYRA_PRICE: number
  var LYRA_24HR: number
  var ETH_PRICE: number
  var ETH_24HR: number
  var BTC_PRICE: number
  var BTC_24HR: number
  var LYRA_ARB: Lyra
  var LYRA_OPT: Lyra
}

declare module '*.json' {
  const value: any
  export default value
}

export {}
