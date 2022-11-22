import { TESTNET } from '../secrets'
import { Client } from 'discord.js'
import { BlockEvent } from '../event'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TwitterApi } from 'twitter-api-v2'
import { DEPOSIT_PROCESSED, STRIKE_ADDED, TRANSFER_TOPIC } from '../constants/topics'
import { CONTRACT_ADDRESSES } from '../constants/contractAddresses'
import Lyra from '@lyrafinance/lyra-js'
import { TrackTransfer } from '../lyra/tracker'
import { TrackDeposits } from '../lyra/deposits'
import printObject from '../utils/printObject'
import { TrackStrikeAdded } from '../lyra/expiries'

export async function TrackEvents(
  discordClient: Client<boolean>,
  discordClientBtc: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient: TwitterApi,
  twitterClient1: TwitterApi,
  rpcClient: Lyra,
): Promise<void> {
  console.log('### Polling Events ###')
  let blockNumber: number | undefined = undefined
  let pollInterval = 60000
  if (TESTNET) {
    blockNumber = rpcClient.provider.blockNumber - 50000
    pollInterval = 500
  }

  BlockEvent.on(
    rpcClient,
    async (event) => {
      if (event[0].topics[0].toLowerCase() === TRANSFER_TOPIC) {
        await TrackTransfer(discordClient, telegramClient, twitterClient1, rpcClient, event[0])
      }
      if (event[0].topics[0].toLowerCase() === DEPOSIT_PROCESSED) {
        await TrackDeposits(discordClient, discordClientBtc, telegramClient, twitterClient1, rpcClient, event[0])
      }
      if (event[0].topics[0].toLowerCase() === STRIKE_ADDED) {
        await TrackStrikeAdded(discordClient, discordClientBtc, telegramClient, twitterClient, rpcClient, event)
      }
    },
    {
      startBlockNumber: blockNumber,
      addresses: CONTRACT_ADDRESSES,
      topics: [STRIKE_ADDED, TRANSFER_TOPIC, DEPOSIT_PROCESSED],
      pollInterval: pollInterval,
    },
  )
}
