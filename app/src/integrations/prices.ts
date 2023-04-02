import axios from 'axios'
import { ETH_OP, BTC_OP, LYRA_TOKENS } from '../constants/contractAddresses'
import { urls } from '../constants/urls'
import { Dexscreener } from '../types/dexscreener'

export async function GetPrices(): Promise<void> {
  try {
    const addresses = [ETH_OP, BTC_OP, LYRA_TOKENS.LYRA_OP]
    const dexscreenerData = (await axios.get(`${urls.dexscreenerUrl}${addresses.join(',')}`)).data as Dexscreener
    console.log(dexscreenerData)
    addresses.map((address) => {
      const pair = dexscreenerData.pairs.find((pair) => pair.baseToken.address.toLowerCase() == address.toLowerCase())
      if (pair) {
        if (address.toLowerCase() == ETH_OP) {
          global.ETH_PRICE = Number(pair.priceUsd)
          global.ETH_24HR = Number(pair.priceChange.h24)
        }
        if (address.toLowerCase() == BTC_OP) {
          global.BTC_PRICE = Number(pair.priceUsd)
          global.BTC_24HR = Number(pair.priceChange.h24)
        }
        if (address.toLowerCase() == LYRA_TOKENS.LYRA_OP) {
          global.LYRA_PRICE = Number(pair.priceUsd)
          //console.log(`LYRA: ${global.LYRA_PRICE}`)
          global.LYRA_24HR = Number(pair.priceChange.h24)
        }
      }
    })
  } catch (error) {
    console.log(error)
  }
}
