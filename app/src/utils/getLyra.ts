import Lyra, { Chain } from '@lyrafinance/lyra-js'
import { alchemyProviderOP, alchemyProviderARB } from '../clients/ethersClient'

export default function getLyra(chain: Chain): Lyra {
  const lyra = new Lyra(chain)
  if (chain === Chain.Optimism) {
    lyra.provider = alchemyProviderOP
  }
  if (chain === Chain.Arbitrum) {
    lyra.provider = alchemyProviderARB
  }
  return lyra
}
