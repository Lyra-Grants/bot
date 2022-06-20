import { TESTNET } from '../secrets'
import Lyra from '@lyrafinance/lyra-js'
import fromBigNumber from '../utils/fromBigNumber'
import { Client } from 'discord.js'
import { TransferDto } from '../types/transferDto'
import { PostDiscord } from '../integrations/discord'
import { TransferDiscord } from '../utils/template'
import { GetEns } from '../integrations/ens'
import { LyraEvent } from '../event'
import { GetNotableAddress } from '../utils/notableAddresses'
import { shortAddress, toDate } from '../utils/utils'

export async function TrackTokenMoves(discordClient: Client<boolean>, lyra: Lyra): Promise<void> {
  console.log('### Polling for Transfers ###')

  let blockNumber: number | undefined = undefined
  if (TESTNET) {
    blockNumber = lyra.provider.blockNumber - 10000
  }

  LyraEvent.on(
    lyra,
    async (event) => {
      const amount = fromBigNumber(event.args.value)
      const value = global.LYRA_PRICE * amount

      if (value >= 1000) {
        try {
          let timestamp = 0
          try {
            timestamp = (await lyra.provider.getBlock(event.blockNumber)).timestamp
          } catch (ex) {
            console.log(ex)
          }
          const from = GetNotableAddress(event.args.from)
          const to = GetNotableAddress(event.args.to)
          const fromEns = await GetEns(event.args.from)
          const toEns = await GetEns(event.args.to)

          const transferDto: TransferDto = {
            from: from === '' ? '🧑 ' + shortAddress(event.args.from) : from,
            to: to === '' ? '🧑 ' + shortAddress(event.args.to) : to,
            amount: amount,
            transactionHash: event.transactionHash,
            fromEns: fromEns,
            toEns: toEns,
            timestamp: timestamp === 0 ? toDate(Date.now()) : toDate(timestamp),
            blockNumber: event.blockNumber,
            value: value,
          }

          console.log(transferDto)
          BroadCastTransfer(transferDto, discordClient)
        } catch (ex) {
          console.log(ex)
        }
      } else {
        console.log('Transfer less than threshold value')
      }
    },
    { startBlockNumber: blockNumber },
  )
}

export async function BroadCastTransfer(transferDto: TransferDto, discordClient: Client<boolean>): Promise<void> {
  const post = TransferDiscord(transferDto)
  await PostDiscord(post, discordClient, 'lyra-token-transfers')
}
