import { BigNumber } from '@ethersproject/bignumber'
import { BlockTag } from '@ethersproject/providers'
import Lyra from '@lyrafinance/lyra-js'
import { Event as GenericEvent } from 'ethers'
import { groupBy } from '../utils/utils'

export type EventListener = {
  off: () => void
}

export type EventListenerCallback = (transfer: GenericEvent[]) => void

export type EventListenerOptions = {
  pollInterval?: number
  startBlockNumber?: BlockTag
  addresses: string[]
  topics: string[]
}
export class BlockEvent {
  static on(rpcClient: Lyra, callback: EventListenerCallback, options?: EventListenerOptions): EventListener {
    const ms = options?.pollInterval ?? 30 * 1000
    const startBlockTag = options?.startBlockNumber ?? 'latest'
    let timeout: NodeJS.Timeout | null

    rpcClient.provider.getBlock(startBlockTag).then(async (block) => {
      console.debug(`Polling from block ${block.number} every ${ms}ms`)
      let prevBlock = block

      const poll = async () => {
        try {
          const latestBlock = await rpcClient.provider.getBlock('latest')
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
            const events: GenericEvent[] = await rpcClient.provider.send('eth_getLogs', [
              {
                fromBlock: BigNumber.from(fromBlockNumber).toHexString(),
                toBlock: BigNumber.from(toBlockNumber).toHexString(),
                address: options?.addresses,
                topics: [options?.topics],
              },
            ])

            // group the events by trx hash
            const groupedEvents = groupBy(events, (i) => i.transactionHash)

            if (Object.keys(groupedEvents).length > 0) {
              console.debug(`Found ${Object.keys(groupedEvents).length} grouped events`)
            }
            await Promise.all(Object.keys(groupedEvents).map((x) => callback(groupedEvents[x])))
          } catch (e) {
            console.warn('Failed to get eth_logs')
          }

          prevBlock = latestBlock
        } catch (error) {
          // catch any error
          console.log(error)
        }
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
