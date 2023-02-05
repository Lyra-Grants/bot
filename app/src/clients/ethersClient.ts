import { ethers } from 'ethers'
import { ALCHEMY_ID, ALCHEMY_ID_ARB, INFURA_ID, INFURA_ID_OPTIMISM } from '../secrets'

const network = 'mainnet'
export const mainNetInfuraProvider = new ethers.providers.InfuraProvider(network, INFURA_ID)
export const optimismInfuraProvider = new ethers.providers.InfuraProvider(10, INFURA_ID_OPTIMISM)
export const arbitrumInfuraProvider = new ethers.providers.InfuraProvider(42161, INFURA_ID_OPTIMISM)
export const alchemyProviderOP = new ethers.providers.AlchemyProvider(10, ALCHEMY_ID)
export const alchemyProviderARB = new ethers.providers.AlchemyProvider(42161, ALCHEMY_ID_ARB)

export const optimsimProvider = new ethers.providers.JsonRpcProvider(
  { url: 'https://mainnet.optimism.io', throttleLimit: 1 },
  10,
)
