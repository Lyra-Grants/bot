import { Network } from '@lyrafinance/lyra-js'
import { ResolveEns } from '../integrations/ens'
import { Trader } from '../types/lyra'
import { FindOnLeaderBoard } from './leaderboard'

export async function GetTrader(account: string, network: Network): Promise<Trader> {
  let trader = await FindOnLeaderBoard(account.toLowerCase(), network)

  if (trader.account == '') {
    const ensAcc = await ResolveEns(account)
    if (ensAcc != '') {
      trader = await FindOnLeaderBoard(ensAcc.toLowerCase(), network)
    }
  }

  return trader
}
