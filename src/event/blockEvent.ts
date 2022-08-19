import { TESTNET } from '../secrets'
import { Client } from 'discord.js'
import { BlockEvent } from '../event'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TwitterApi } from 'twitter-api-v2'
import { DEPOSIT_QUEUED, TRANSFER_TOPIC } from '../constants/topics'
import { CONTRACT_ADDRESSES } from '../constants/contractAddresses'
import Lyra from '@lyrafinance/lyra-js'
import { TrackTransfer } from '../token/tracker'
import { TrackDeposits } from '../lyra/deposits'

export async function TrackEvents(
  discordClient: Client<boolean>,
  discordClientBtc: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient1: TwitterApi,
  rpcClient: Lyra,
  quantClient: TwitterApi,
): Promise<void> {
  console.log('### Polling Events ###')
  let blockNumber: number | undefined = undefined
  if (TESTNET) {
    blockNumber = rpcClient.provider.blockNumber - 10000
  }

  BlockEvent.on(
    rpcClient,
    async (event) => {
      if (event.topics[0].toLowerCase() === TRANSFER_TOPIC) {
        // deal with token transfers
        TrackTransfer(discordClient, telegramClient, twitterClient1, rpcClient, event, quantClient)
      }
      if (event.topics[0].toLowerCase() === DEPOSIT_QUEUED) {
        // deal with q'd deposits
        TrackDeposits(discordClient, discordClientBtc, telegramClient, twitterClient1, rpcClient, event, quantClient)
      }
    },
    {
      startBlockNumber: blockNumber,
      addresses: CONTRACT_ADDRESSES,
      topics: [TRANSFER_TOPIC, DEPOSIT_QUEUED],
    },
  )
}
