import { ethers } from 'ethers'
import { ENTROPY } from '../utils/secrets'

export function Generate(): ethers.Wallet {
  return ethers.Wallet.createRandom({ extraEntropy: ENTROPY })
}
