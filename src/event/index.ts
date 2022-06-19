import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { BlockTag, Log } from '@ethersproject/providers'
import { Event as GenericEvent } from 'ethers'
import Lyra, { ERC20, ERC20__factory } from '@lyrafinance/lyra-js'
import { TransferEvent } from '@lyrafinance/lyra-js/dist/types/contracts/typechain/ERC20'
import { LYRA_TOKEN } from '../utils/secrets'

export type EventListener = {
  off: () => void
}

export type EventListenerCallback = (transfer: TransferEvent) => void

export type EventListenerOptions = {
  pollInterval?: number
  startBlockNumber?: BlockTag
}

export function getTransferFromLog(event: TransferEvent, contract: Contract): TransferEvent {
  const ERC20Contract = contract as ERC20
  const parsedEvent = ERC20Contract.interface.parseLog(event)

  if ((parsedEvent.args as TransferEvent['args']).length > 0) {
    event.args = parsedEvent.args as TransferEvent['args']
  }
  return event
}

// make this be able
export class LyraEvent {
  static on(lyra: Lyra, callback: EventListenerCallback, options?: EventListenerOptions): EventListener {
    const ms = options?.pollInterval ?? 7.5 * 1000
    const startBlockTag = options?.startBlockNumber ?? 'latest'

    let timeout: NodeJS.Timeout | null

    const lyraTokenContract = new Contract(LYRA_TOKEN, ERC20__factory.createInterface()) as ERC20
    const transferTopic = (lyraTokenContract.filters.Transfer().topics ?? [])[0]

    lyra.provider.getBlock(startBlockTag).then(async (block) => {
      // start the polling token
      console.debug(`Polling from block ${block.number} every ${ms}ms`)
      let prevBlock = block

      const poll = async () => {
        const latestBlock = await lyra.provider.getBlock('latest')
        const fromBlockNumber = prevBlock.number + 1
        const toBlockNumber = latestBlock.number
        if (fromBlockNumber >= toBlockNumber) {
          setTimeout(poll, ms)
          return
        }
        console.debug(
          `Querying block range: ${fromBlockNumber} to ${toBlockNumber} (${toBlockNumber - fromBlockNumber} blocks)`,
        )

        try {
          const events: GenericEvent[] = await lyra.provider.send('eth_getLogs', [
            {
              fromBlock: BigNumber.from(fromBlockNumber).toHexString(), // from block
              toBlock: BigNumber.from(toBlockNumber).toHexString(), // to block
              address: LYRA_TOKEN, // the address field represents the address of the contract emitting the log.
              topics: [[transferTopic]],
            },
          ])

          if (events.length > 0) {
            console.debug(`Found ${events.length} events`)
          }

          await Promise.all(
            events.map(async (event) => {
              if (event.topics[0] === transferTopic) {
                try {
                  let transferEvent = event as TransferEvent
                  transferEvent = getTransferFromLog(transferEvent, lyraTokenContract)
                  callback(transferEvent)
                } catch (e) {
                  console.warn('Failed to read deposit event', event.transactionHash)
                }
              }
            }),
          )
        } catch (e) {
          console.warn('Failed to get eth_logs')
        }

        // Poll
        prevBlock = latestBlock
        setTimeout(poll, ms)
      }
      timeout = setTimeout(poll, ms)
    })

    return {
      off: () => {
        if (timeout) {
          clearTimeout(timeout)
        }
      },
    }
  }
}
