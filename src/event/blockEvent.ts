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
  twitterClient: TwitterApi,
  rpcClient: Lyra,
): Promise<void> {
  console.log('### Polling Events ###')
  let blockNumber: number | undefined = undefined
  if (TESTNET) {
    blockNumber = rpcClient.provider.blockNumber - 10000
  }

  BlockEvent.on(
    rpcClient,
    async (event) => {
      // track different events based on event type
      // can do this using the topic - topic[0] is the type of even
      // Object.entries(groupedEvent).forEach(([key, value]) => {
      //   console.log(key, value)
      // })
      if (event.topics[0] === TRANSFER_TOPIC) {
        // deal with token transfers
        TrackTransfer(discordClient, telegramClient, twitterClient, rpcClient, event)
      }
    },
    {
      startBlockNumber: blockNumber,
      addresses: CONTRACT_ADDRESSES,
      topics: [TRANSFER_TOPIC],
    },
  )
}
