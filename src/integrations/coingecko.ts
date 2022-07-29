import { response } from 'express'
import { CoinGeckoClient } from '../clients/coinGeckoClient'
import { LyraDto } from '../types/lyraDto'
import printObject from '../utils/printObject'

export async function GetPrice(): Promise<void> {
  try {
    await CoinGeckoClient.simple
      .price({ ids: ['ethereum', 'lyra-finance'], vs_currencies: 'usd', include_24hr_change: true })
      .then((resp) => {
        printObject(resp.data)
        global.ETH_PRICE = resp.data['ethereum'].usd
        global.ETH_24HR = resp.data['ethereum'].usd_24h_change
        global.LYRA_PRICE = resp.data['lyra-finance'].usd
        global.LYRA_24HR = resp.data['lyra-finance'].usd_24h_change
      })
  } catch (error) {
    console.log(error)
  }
}

export async function GetLyraInfo(): Promise<LyraDto | undefined> {
  try {
    const resp = await CoinGeckoClient.coins.fetch('lyra-finance', { community_data: false, developer_data: false })

    return {
      price: resp.data['market_data']['current_price']['usd'],
      marketCap: resp.data['market_data']['market_cap']['usd'],
      totalSupply: resp.data['market_data']['total_supply'],
      marketCapRank: resp.data['market_cap_rank'],
      tvl: resp.data['market_data']['total_value_locked']['usd'],
      fdv: resp.data['market_data']['fully_diluted_valuation']['usd'],
      price_24h: (resp.data['market_data'] as any)['price_change_percentage_24h'] as number,
      fdv_tvl_ratio: resp.data['market_data']['fdv_to_tvl_ratio'],
      mc_tvl_ratio: resp.data['market_data']['mcap_to_tvl_ratio'],
      circSupply: resp.data['market_data']['circulating_supply'],
      maxSupply: resp.data['market_data']['max_supply'],
    }
  } catch (error) {
    console.log(error)
  }
  return undefined
}
