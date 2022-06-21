import Lyra, { Market } from '@lyrafinance/lyra-js'
import { StatDto } from '../types/statDto'

export async function GetStats(market: string, lyra: Lyra): Promise<StatDto> {
  const marketObj = await Market.get(lyra, market)

  const stat: StatDto = {
    asset: marketObj.name,
    poolValue: 0,
    totalsUsd: 0,
    netCollateral: 0,
    netOptionsDelta: 0,
    netDelta: 0,
    netStdVega: 0,
    pnl: 0,
    timestamp: new Date(),
  }

  return stat
}
