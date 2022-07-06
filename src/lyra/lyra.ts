import { CoinGeckoClient } from '../clients/coinGeckoClient'
import { GetLyraInfo } from '../integrations/coingecko'
import { LyraDto } from '../types/lyraDto'
import printObject from '../utils/printObject'

export async function GetLyra(): Promise<LyraDto> {
  const lyraInfo = await GetLyraInfo()
  return lyraInfo
}
