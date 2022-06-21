import Lyra, { Market } from '@lyrafinance/lyra-js'
import { StatDto } from '../types/statDto'
import fromBigNumber from '../utils/fromBigNumber'

export async function GetStats(marketName: string, lyra: Lyra): Promise<StatDto> {
  const market = await Market.get(lyra, marketName)
  const liquidity = await market.liquidity
  const greeks = await market.netGreeks()

  const stat: StatDto = {
    asset: market.name,
    poolValue: fromBigNumber(liquidity.nav),
    totalsUsd: 0,
    netCollateral: 0,
    netOptionsDelta: 0,
    netDelta: fromBigNumber(greeks.netDelta),
    netStdVega: fromBigNumber(greeks.netStdVega),
    pnl: 0,
    timestamp: new Date(),
  }
  return stat
}
