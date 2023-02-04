import { GetLyraInfo } from '../integrations/coingecko'
import { LyraDto } from '../types/lyra'

export async function GetCoinGecko(): Promise<LyraDto> {
  return (await GetLyraInfo()) as LyraDto
}
