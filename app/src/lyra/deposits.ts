import { DISCORD_ENABLED, TWITTER_ENABLED, DEPOSIT_THRESHOLD } from '../config'
import fromBigNumber from '../utils/fromBigNumber'
import { ActionRowBuilder, ButtonBuilder, Client } from 'discord.js'
import { PostDiscord } from '../discord'
import { GetEns } from '../integrations/ens'
import { GetNotableAddress } from '../utils/notableAddresses'
import { SendTweet } from '../integrations/twitter'
import { Event as GenericEvent } from 'ethers'
import { TwitterApi } from 'twitter-api-v2'
import { DEPOSITS_CHANNEL } from '../constants/discordChannels'
import { Network, NewportLiquidityPool__factory } from '@lyrafinance/lyra-js'
import { DepositDto } from '../types/lyra'
import { DepositDiscord, DepositTwitter } from '../templates/deposit'
import { GetAsset, GetMarket } from '../templates/common'
import { GetUrl } from '../utils/utils'
import {
  DepositProcessedEvent,
  DepositQueuedEvent,
} from '@lyrafinance/lyra-js/src/contracts/avalon/typechain/AvalonLiquidityPool'

export async function TrackDeposits(
  discordClient: Client,
  twitterClient: TwitterApi,
  genericEvent: GenericEvent,
  network: Network,
): Promise<void> {
  const event = parseProcessedEvent(genericEvent as DepositProcessedEvent)
  const amount = fromBigNumber(event.args.amountDeposited)
  const value = amount
  const from = GetNotableAddress(event.args.caller.toLowerCase())
  const fromAddress = event.args.caller
  const to = GetNotableAddress(event.args.beneficiary.toLowerCase())
  const toAddress = event.args.beneficiary.toLowerCase()
  const toEns = await GetEns(event.args.beneficiary.toLowerCase())
  const isNotable = from !== ''

  console.log(`Deposit Value: ${value}, threshold: ${DEPOSIT_THRESHOLD}`)

  if (value >= Number(DEPOSIT_THRESHOLD)) {
    try {
      const dto: DepositDto = {
        account: toAddress,
        ens: toEns,
        asset: GetAsset(genericEvent.address),
        market: GetMarket(genericEvent.address),
        notableAddress: from,
        to: to === '' ? toAddress : to,
        amount: amount,
        value: value,
        notableTo: to !== '',
        isNotable: isNotable,
        fromAddress: fromAddress,
        toAddress: toAddress,
        totalQueued: 0,
        url: GetUrl(event.args.beneficiary.toLowerCase(), isNotable),
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
      }
      await BroadCastDeposit(dto, discordClient, twitterClient, network)
    } catch (ex) {
      console.log(ex)
    }
  } else {
    console.log(`Deposit less than $${DEPOSIT_THRESHOLD} threshold value`)
  }
}

export async function BroadCastDeposit(
  dto: DepositDto,
  discordClient: Client,
  twitterClient: TwitterApi,
  network: Network,
): Promise<void> {
  if (DISCORD_ENABLED) {
    const post = DepositDiscord(dto, network)
    const rows: ActionRowBuilder<ButtonBuilder>[] = []
    await PostDiscord(post, rows, discordClient, DEPOSITS_CHANNEL)
  }

  if (TWITTER_ENABLED) {
    const post = DepositTwitter(dto, network)
    await SendTweet(post, twitterClient)
  }
}

export function parseEvent(event: DepositQueuedEvent): DepositQueuedEvent {
  const parsedEvent = NewportLiquidityPool__factory.createInterface().parseLog(event)

  if ((parsedEvent.args as DepositQueuedEvent['args']).length > 0) {
    event.args = parsedEvent.args as DepositQueuedEvent['args']
  }
  return event
}

export function parseProcessedEvent(event: DepositProcessedEvent): DepositProcessedEvent {
  const parsedEvent = NewportLiquidityPool__factory.createInterface().parseLog(event)

  if ((parsedEvent.args as DepositProcessedEvent['args']).length > 0) {
    event.args = parsedEvent.args as DepositProcessedEvent['args']
  }
  return event
}
