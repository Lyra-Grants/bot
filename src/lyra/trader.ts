import Lyra from '@lyrafinance/lyra-js'
import { ResolveEns } from '../integrations/ens'
import { Trader } from '../types/lyra'
import { FindOnLeaderBoard } from './leaderboard'

export async function GetTrader(account: string, lyra: Lyra): Promise<Trader> {
  let trader = await FindOnLeaderBoard(account)

  if (trader.account == '') {
    // try with ens

    const ensAcc = await ResolveEns(account)
    if (ensAcc != '') {
      trader = await FindOnLeaderBoard(ensAcc)
    }
  }

  return trader
}
