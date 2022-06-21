import { CoinGeckoClient } from '../clients/coinGeckoClient'
import printObject from '../utils/printObject'

export async function GetPrice(): Promise<void> {
  await CoinGeckoClient.simple
    .price({ ids: ['ethereum', 'lyra'], vs_currencies: 'usd', include_24hr_change: true })
    .then((resp) => {
      //console.log(`Eth: ${resp.data['ethereum'].usd}`)
      printObject(resp.data)
      global.ETH_PRICE = resp.data['ethereum'].usd
      global.ETH_24HR = resp.data['ethereum'].usd_24h_change
      global.LYRA_PRICE = resp.data['lyra'].usd
      global.LYRA_24HR = resp.data['lyra'].usd_24h_change
    })
}
