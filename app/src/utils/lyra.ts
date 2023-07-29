import Lyra, { Version, Network } from '@lyrafinance/lyra-js'
import { NETWORK_CONFIGS } from '../constants/networks'
import CachedStaticJsonRpcProvider from './CachedStaticJsonRpcProvider'
import getArbitrumChainId from './getArbitrumChainId'
import getChainForChainId from './getChainForChainId'
import getOptimismChainId from './getOptimismChainId'
import { SATSUMA_API_KEY } from '../config'

const optimismChainId = getOptimismChainId()
const optimismNetworkConfig = NETWORK_CONFIGS[getChainForChainId(optimismChainId)]

export const optimismProvider = new CachedStaticJsonRpcProvider(
  optimismNetworkConfig.readRpcUrls,
  optimismNetworkConfig.chainId,
)

const arbitrumChainId = getArbitrumChainId()
const arbitrumNetworkConfig = NETWORK_CONFIGS[getChainForChainId(arbitrumChainId)]

const getLyraSubgraphURI = (network: Network): string | undefined => {
  switch (network) {
    case Network.Optimism:
      return `https://subgraph.satsuma-prod.com/${SATSUMA_API_KEY}/lyra/optimism-mainnet-newport/api`

    case Network.Arbitrum:
      return `https://subgraph.satsuma-prod.com/${SATSUMA_API_KEY}/lyra/arbitrum-mainnet/api`
  }
}

const getLyraGovSubgraphURI = (network: Network): string | undefined => {
  switch (network) {
    case Network.Optimism:
      return `https://subgraph.satsuma-prod.com/${SATSUMA_API_KEY}/lyra/optimism-governance/api`
    case Network.Arbitrum:
      return `https://subgraph.satsuma-prod.com/${SATSUMA_API_KEY}/lyra/arbitrum-governance/api`
  }
}

export const arbitrumProvider = new CachedStaticJsonRpcProvider(
  arbitrumNetworkConfig.readRpcUrls,
  arbitrumNetworkConfig.chainId,
)

export const lyraOptimism = new Lyra({
  provider: optimismProvider,
  apiUri: process.env.REACT_APP_API_URL,
  subgraphUri: getLyraSubgraphURI(Network.Optimism),
  govSubgraphUri: getLyraGovSubgraphURI(Network.Optimism),
  version: Version.Newport,
})

export const lyraArbitrum = new Lyra({
  provider: arbitrumProvider,
  apiUri: process.env.REACT_APP_API_URL,
  subgraphUri: getLyraSubgraphURI(Network.Arbitrum),
  govSubgraphUri: getLyraGovSubgraphURI(Network.Arbitrum),
  version: Version.Newport,
})
