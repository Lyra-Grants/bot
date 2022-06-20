import { ethers } from 'ethers'
import { INFURA_ID } from '../secrets'

const network = 'mainnet'
export const mainNetInfuraProvider = new ethers.providers.InfuraProvider(network, INFURA_ID)

export const optimsimProvider = new ethers.providers.JsonRpcProvider(
  { url: 'https://mainnet.optimism.io', throttleLimit: 1 },
  10,
)
