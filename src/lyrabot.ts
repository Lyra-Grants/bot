import { RunTradeBot } from './lyra/trades'
import { GetLeaderBoard } from './lyra/leaderboard'

export async function initializeLyraBot() {
  global.LYRA_LEADERBOARD = await GetLeaderBoard()
  global.LYRA_ENS = {}
  //console.log(global.LYRA_LEADERBOARD)

  await RunTradeBot()
}
