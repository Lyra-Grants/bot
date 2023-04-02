import axios from 'axios'
import { ETH_OP, BTC_OP, LYRA_OP } from '../constants/contractAddresses'
import { urls } from '../constants/urls'
import { Dexscreener } from '../types/dexscreener'

export async function GetPrices(): Promise<void> {
  try {
    const addresses = [LYRA_OP, ETH_OP, BTC_OP]
    addresses.map(async (address) => {
      const dexscreenerData = (await axios.get(`${urls.dexscreenerUrl}${address}`)).data as Dexscreener
      const pair = dexscreenerData.pairs.find((pair) => pair.baseToken.address.toLowerCase() == address.toLowerCase())
      if (pair) {
        if (address.toLowerCase() == ETH_OP.toLowerCase()) {
          global.ETH_PRICE = Number(pair.priceUsd)
          global.ETH_24HR = Number(pair.priceChange.h24)
          //console.log(`New ETH PRICE: ${global.ETH_PRICE}`)
        }
        if (address.toLowerCase() == BTC_OP.toLowerCase()) {
          global.BTC_PRICE = Number(pair.priceUsd)
          global.BTC_24HR = Number(pair.priceChange.h24)
          //console.log(`New BTC PRICE: ${global.BTC_PRICE}`)
        }
        if (address.toLowerCase() == LYRA_OP.toLowerCase()) {
          global.LYRA_PRICE = Number(pair.priceUsd)
          global.LYRA_24HR = Number(pair.priceChange.h24)
          //console.log(`New LYRA PRICE: ${global.LYRA_PRICE}`)
        }
      } else {
        console.log(`Pair not found: ${address.toLowerCase()}`)
      }
    })
  } catch (error) {
    console.log(error)
  }
}
