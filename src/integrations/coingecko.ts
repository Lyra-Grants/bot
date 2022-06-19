import { CoinGeckoClient } from '../clients/coinGeckoClient'

export async function GetPrice(): Promise<void> {
  await CoinGeckoClient.simple.price({ ids: 'lyra-finance', vs_currencies: 'usd' }).then((resp) => {
    console.log(`Lyra: ${resp.data['lyra-finance'].usd}`)
    global.LYRA_PRICE = resp.data['lyra-finance'].usd
  })
}
