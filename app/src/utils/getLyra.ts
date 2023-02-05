import Lyra, { Chain } from '@lyrafinance/lyra-js'
//import { alchemyProvider } from '../clients/ethersClient'

export default function getLyra(chain: Chain): Lyra {
  const lyra = new Lyra(chain)
  return lyra
}
