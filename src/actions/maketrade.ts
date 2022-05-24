import Lyra, { Trade, TradeEvent } from '@lyrafinance/lyra-js'
import { ethers } from 'ethers'
import { MAX_BN, ONE_BN } from '../constants/bn'
import printObject from '../utils/printObject'

export async function maketrade(lyraClient: Lyra, signer: ethers.Wallet) {
  const account = lyraClient.account(signer.address)

  // market
  const market = await lyraClient.market('eth')
  console.log(market)

  // most recent expiry
  const board = market.liveBoards()[0]
  console.log(board)

  // strike
  const strike = board.strikes().find((strike) => strike.isDeltaInRange)
  if (!strike) {
    console.log('No strike')
    return
  }

  // Approve
  const approveTx = await account.approveStableToken(market.quoteToken.address, MAX_BN)
  const approveResponse = await signer.sendTransaction(approveTx)
  await approveResponse.wait()
  console.log('Approved sUSD')

  // Prepare trade (Open 1.0 Long ETH Call)
  const trade = await Trade.get(lyraClient, account.address, 'eth', strike.id, true, true, ONE_BN.div(100), {
    premiumSlippage: 0.1 / 100, // 0.1%
  })

  // Check if trade is disabled
  if (!trade.tx) {
    throw new Error(`Trade is disabled: ${trade.disabledReason}`)
  }

  const tradeResponse = await signer.sendTransaction(trade.tx)
  console.log('Executed trade:', tradeResponse.hash)
  const tradeReceipt = await tradeResponse.wait()

  // Get trade result
  const tradeEvent = (await TradeEvent.getByHash(lyraClient, tradeReceipt.transactionHash))[0]

  printObject('Trade Result', {
    blockNumber: tradeEvent.blockNumber,
    positionId: tradeEvent.positionId,
    premium: tradeEvent.premium,
    fee: tradeEvent.fee,
  })
}
