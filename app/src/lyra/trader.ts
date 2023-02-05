import { ResolveEns } from '../integrations/ens'
import { Trader } from '../types/lyra'
import { FindOnLeaderBoard } from './leaderboard'

export async function GetTrader(account: string): Promise<Trader> {
  let trader = await FindOnLeaderBoard(account.toLowerCase())

  if (trader.account == '') {
    const ensAcc = await ResolveEns(account)
    if (ensAcc != '') {
      trader = await FindOnLeaderBoard(ensAcc.toLowerCase())
    }
  }

  return trader
}
