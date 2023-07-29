import axios from 'axios'
import { ETH_OP, BTC_OP, OP_OP, ARB_OP, LYRA_OP } from '../constants/contractAddresses'
import { urls } from '../constants/urls'
import { Dexscreener, Pair } from '../types/dexscreener'

export async function GetPrices() {
  const pairs: Pair[] = []

  try {
    const [dexEth, dexBtc, dexOp, dexArb, dexLyra] = await Promise.all([
      axios.get<Dexscreener>(`${urls.dexscreenerUrl}${ETH_OP}`),
      axios.get<Dexscreener>(`${urls.dexscreenerUrl}${BTC_OP}`),
      axios.get<Dexscreener>(`${urls.dexscreenerUrl}${OP_OP}`),
      axios.get<Dexscreener>(`${urls.dexscreenerUrl}${ARB_OP}`),
      axios.get<Dexscreener>(`${urls.dexscreenerUrl}${LYRA_OP}`),
    ])

    try {
      // ETH
      const pairEth = dexEth.data?.pairs.find((pair) => pair.baseToken.address.toLowerCase() == ETH_OP.toLowerCase())
      if (pairEth) {
        pairs.push(pairEth)
      }
      // BTC
      const pairBtc = dexBtc.data?.pairs.find((pair) => pair.baseToken.address.toLowerCase() == BTC_OP.toLowerCase())
      if (pairBtc) {
        pairs.push(pairBtc)
      }
      // OP
      const pairOp = dexOp.data?.pairs.find((pair) => pair.baseToken.address.toLowerCase() == OP_OP.toLowerCase())
      if (pairOp) {
        pairs.push(pairOp)
      }
      // ARB
      const pairArb = dexArb.data?.pairs.find((pair) => pair.baseToken.address.toLowerCase() == ARB_OP.toLowerCase())
      if (pairArb) {
        pairs.push(pairArb)
      }
      // LYRA
      const pairLyra = dexLyra.data?.pairs.find((pair) => pair.baseToken.address.toLowerCase() == LYRA_OP.toLowerCase())
      if (pairLyra) {
        pairs.push(pairLyra)
      }
    } catch (error) {
      console.log(error)
    }
  } catch (error) {
    console.log(error)
  }
  return pairs
}

export function GetPricePair(market: string) {
  try {
    if (market.toLowerCase() == 'eth') {
      market = 'weth'
    }

    if (market.toLowerCase() == 'btc') {
      market = 'wbtc'
    }

    const pricePair = global.PRICES.find((pair) => pair.baseToken.symbol.toLowerCase() == market.toLowerCase())
    if (pricePair) {
      return pricePair
    }
  } catch (error) {
    console.log(error)
  }
  return undefined
}

export function GetPrice(market: string) {
  const pricePair = GetPricePair(market)
  if (pricePair) {
    return Number(pricePair.priceUsd)
  }
  return 1
}
