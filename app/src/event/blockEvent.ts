import { TESTNET } from '../config'
import { Client } from 'discord.js'
import { BlockEvent } from '../event'
import { Telegraf } from 'telegraf'
import { TwitterApi } from 'twitter-api-v2'
import { DEPOSIT_PROCESSED, STRIKE_ADDED, TRANSFER_TOPIC } from '../constants/topics'
import { CONTRACT_ADDRESSES } from '../constants/contractAddresses'
import { Network } from '@lyrafinance/lyra-js'
import { TrackTransfer } from '../lyra/tracker'
import { TrackDeposits } from '../lyra/deposits'
import getLyraSDK from '../utils/getLyraSDK'
import { TrackStrikeAdded } from '../lyra/expiries'

export async function TrackEvents(
  discordClient: Client,
  telegramClient: Telegraf,
  twitterClient: TwitterApi,
  twitterClient1: TwitterApi,
  network: Network,
): Promise<void> {
  console.log('### Polling for Events - Deposits | Transfers | Strikes ###')
  const lyra = getLyraSDK(network)
  let blockNumber: number | undefined = undefined
  let pollInterval = 60000
  if (TESTNET) {
    blockNumber = lyra.provider.blockNumber - 5000
    pollInterval = 3000
  }

  BlockEvent.on(
    lyra,
    async (event) => {
      if (event[0].topics[0].toLowerCase() === TRANSFER_TOPIC.toLowerCase()) {
        await TrackTransfer(discordClient, twitterClient1, event[0], network)
      }
      if (event[0].topics[0].toLowerCase() === DEPOSIT_PROCESSED.toLowerCase()) {
        await TrackDeposits(discordClient, twitterClient1, event[0], network)
      }
      if (event[0].topics[0].toLowerCase() === STRIKE_ADDED.toLowerCase()) {
        await TrackStrikeAdded(discordClient, telegramClient, twitterClient, network, event)
      }
    },
    {
      startBlockNumber: blockNumber,
      addresses: CONTRACT_ADDRESSES,
      topics: [STRIKE_ADDED, DEPOSIT_PROCESSED, TRANSFER_TOPIC], //STRIKE_ADDED, ,DEPOSIT_PROCESSED //TRANSFER_TOPIC
      pollInterval: pollInterval,
    },
  )
}
