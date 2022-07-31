import { TESTNET } from '../secrets'
import { Client } from 'discord.js'
import { BlockEvent } from '../event'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TwitterApi } from 'twitter-api-v2'
import { TRANSFER_TOPIC } from '../constants/topics'
import { CONTRACT_ADDRESSES } from '../constants/contractAddresses'
import Lyra from '@lyrafinance/lyra-js'
import { TrackTransfer } from '../token/tracker'

export async function TrackEvents(
  discordClient: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient1: TwitterApi,
  rpcClient: Lyra,
): Promise<void> {
  console.log('### Polling Events ###')
  let blockNumber: number | undefined = undefined
  if (TESTNET) {
    blockNumber = rpcClient.provider.blockNumber - 2000
  }
  let count = 0
  BlockEvent.on(
    rpcClient,
    async (event) => {
      if (event.topics[0] === TRANSFER_TOPIC) {
        // deal with token transfers
        if (count == 0) {
          TrackTransfer(discordClient, telegramClient, twitterClient1, rpcClient, event)
        }
        count++
      }
    },
    {
      startBlockNumber: blockNumber,
      addresses: CONTRACT_ADDRESSES,
      topics: [TRANSFER_TOPIC],
    },
  )
}
