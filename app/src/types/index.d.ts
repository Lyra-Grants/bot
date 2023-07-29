/* eslint-disable no-var */

import Lyra from '@lyrafinance/lyra-js'
import { Fren } from './fren'
import { LeaderboardElement } from './leaderboardAPI'
import { Pair } from './dexscreener'

declare global {
  var LEADERBOARD_ARB: LeaderboardElement[] = []
  var LEADERBOARD_OPT: LeaderboardElement[] = []
  var LYRA_ENS: { [key: string]: string } = {}
  var FREN: { [key: string]: Fren } = {}
  var LYRA_ARB: Lyra
  var LYRA_OPT: Lyra
  var PRICES: Pair[] = []
}

declare module '*.json' {
  const value: any
  export default value
}

export {}
