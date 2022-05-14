import { ethers } from 'ethers'
import { INFURA_ID } from '../utils/secrets'

const network = 'mainnet'
export const mainNetInfuraProvider = new ethers.providers.InfuraProvider(network, INFURA_ID)
