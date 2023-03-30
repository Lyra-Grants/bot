import axios from 'axios'
import { ETH_OP, BTC_OP, LYRA_TOKENS } from '../constants/contractAddresses'
import { urls } from '../constants/urls'
import { Dexscreener } from '../types/dexscreener'

export async function GetPrices(): Promise<void> {
  try {
    const addresses = [ETH_OP, BTC_OP, LYRA_TOKENS.LYRA_ETH]
    const dexscreenerData = (await axios.get(`${urls.dexscreenerUrl}${addresses.join(',')}`)).data as Dexscreener

    addresses.map((address) => {
      const pair = dexscreenerData.pairs.find((pair) => pair.baseToken.address.toLowerCase() == address)
      if (pair) {
        if (address == ETH_OP) {
          global.ETH_PRICE = Number(pair.priceUsd)
          global.ETH_24HR = Number(pair.priceChange.h24)
        }
        if (address == BTC_OP) {
          global.BTC_PRICE = Number(pair.priceUsd)
          global.BTC_24HR = Number(pair.priceChange.h24)
        }
        if (address == LYRA_TOKENS.LYRA_ETH) {
          global.LYRA_PRICE = Number(pair.priceUsd)
          global.LYRA_24HR = Number(pair.priceChange.h24)
        }
      }
    })
  } catch (error) {
    console.log(error)
  }
}
