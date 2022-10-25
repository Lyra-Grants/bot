import { TESTNET } from '../secrets'
import { Client } from 'discord.js'
import { BlockEvent } from '../event'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TwitterApi } from 'twitter-api-v2'
import { DEPOSIT_PROCESSED, DEPOSIT_QUEUED, STRIKE_ADDED, TRANSFER_TOPIC } from '../constants/topics'
import { CONTRACT_ADDRESSES } from '../constants/contractAddresses'
import Lyra from '@lyrafinance/lyra-js'
import { TrackTransfer } from '../token/tracker'
import { TrackDeposits } from '../lyra/deposits'
import printObject from '../utils/printObject'

export async function TrackEvents(
  discordClient: Client<boolean>,
  discordClientBtc: Client<boolean>,
  discordClientSol: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient1: TwitterApi,
  rpcClient: Lyra,
): Promise<void> {
  console.log('### Polling Events ###')
  let blockNumber: number | undefined = undefined
  let pollInterval = 60000
  if (TESTNET) {
    blockNumber = rpcClient.provider.blockNumber - 100000
    pollInterval = 500
  }

  BlockEvent.on(
    rpcClient,
    async (event) => {
      // if (event.topics[0].toLowerCase() === TRANSFER_TOPIC) {
      //   await TrackTransfer(discordClient, telegramClient, twitterClient1, rpcClient, event)
      // }
      // if (event.topics[0].toLowerCase() === DEPOSIT_PROCESSED) {
      //   await TrackDeposits(
      //     discordClient,
      //     discordClientBtc,
      //     discordClientSol,
      //     telegramClient,
      //     twitterClient1,
      //     rpcClient,
      //     event,
      //     false, //event.topics[0].toLowerCase() === DEPOSIT_QUEUED,
      //   )
      // }
      if (event.topics[0].toLowerCase() === STRIKE_ADDED) {
        //
        console.log('strike added')
        printObject(event)
      }
    },
    {
      startBlockNumber: blockNumber,
      addresses: CONTRACT_ADDRESSES,
      topics: [STRIKE_ADDED], //TRANSFER_TOPIC, DEPOSIT_PROCESSED,
      pollInterval: pollInterval,
    },
  )
}
