import { initializeLyraBot } from './lyrabot'
import printObject from './utils/printObject'
import { Generate } from './wallets/wallet'

// const TestWallet = Generate()
// console.log(TestWallet)

initializeLyraBot().then(() => console.log('Lyrabot is launched'))
