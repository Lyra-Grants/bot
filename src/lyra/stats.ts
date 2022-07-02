import Lyra, { Market } from '@lyrafinance/lyra-js'
import { ZERO_BN } from '../constants/bn'
import { SECONDS_IN_MONTH } from '../constants/timeAgo'
import { StatDto } from '../types/statDto'
import fromBigNumber from '../utils/fromBigNumber'

export async function GetStats(marketName: string, lyra: Lyra): Promise<StatDto> {
  // get timestamp from month ago
  const startTimestamp = Math.floor(Date.now() / 1000 - SECONDS_IN_MONTH)
  const market = await Market.get(lyra, marketName)

  const [tradingVolumeHistory, liquidityHistory, netGreeks] = await Promise.all([
    market.tradingVolumeHistory({ startTimestamp }),
    market.liquidityHistory({ startTimestamp }),
    market.netGreeks(),
  ])

  const totalNotionalVolume = tradingVolumeHistory[tradingVolumeHistory.length - 1].totalNotionalVolume
  const totalNotionalVolume30DAgo = tradingVolumeHistory[0].totalNotionalVolume
  const tradingVolume30D = fromBigNumber(totalNotionalVolume.sub(totalNotionalVolume30DAgo))
  const fees = tradingVolumeHistory.reduce(
    (sum, tradingVolume) =>
      sum
        .add(tradingVolume.deltaCutoffFees)
        .add(tradingVolume.lpLiquidationFees)
        .add(tradingVolume.optionPriceFees)
        .add(tradingVolume.spotPriceFees)
        .add(tradingVolume.vegaFees)
        .add(tradingVolume.varianceFees),
    ZERO_BN,
  )

  const liquidity = market.liquidity
  const tvl = fromBigNumber(market.tvl)
  const tvl30DAgo = liquidityHistory.length ? fromBigNumber(liquidityHistory[0].nav) : 0
  const tvlChange = tvl30DAgo > 0 ? ((tvl - tvl30DAgo) / tvl30DAgo) * 100 : 1.0
  const tokenPrice = fromBigNumber(liquidity.tokenPrice)
  const tokenPrice30DAgo = liquidityHistory.length ? fromBigNumber(liquidityHistory[0].tokenPrice) : 0
  const tokenPriceChange = tokenPrice30DAgo > 0 ? ((tokenPrice - tokenPrice30DAgo) / tokenPrice30DAgo) * 100 : 1.0
  const openInterestUsd = fromBigNumber(market.openInterest) * fromBigNumber(market.spotPrice)

  console.log([tokenPrice30DAgo])
  console.log([tokenPrice])
  console.log([tokenPriceChange])

  const stat: StatDto = {
    asset: market.name,
    tvl: tvl,
    tvlChange: tvlChange,
    tokenPrice: tokenPrice,
    pnlChange: tokenPriceChange,
    openInterestUsd: openInterestUsd,
    openInterestBase: fromBigNumber(market.openInterest),
    netDelta: fromBigNumber(netGreeks.netDelta),
    netStdVega: fromBigNumber(netGreeks.netStdVega),
    timestamp: new Date(),
    tradingFees: fromBigNumber(fees),
    tradingVolume: tradingVolume30D,
  }
  return stat
}
