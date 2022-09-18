import { initializeLyraBot } from './lyrabot'
import { Generate } from './wallets/wallet'

// const TestWallet = Generate()
// console.log(TestWallet)

initializeLyraBot().then(() => console.log('Lyrabot is launched'))
