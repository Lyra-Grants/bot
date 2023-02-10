import { Network } from '@lyrafinance/lyra-js'

const getLyra = (network: Network) => {
  switch (network) {
    case Network.Arbitrum:
      return global.LYRA_ARB
    case Network.Optimism:
      return global.LYRA_OPT
  }
}

export default getLyra
