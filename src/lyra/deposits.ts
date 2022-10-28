import { DISCORD_ENABLED, TELEGRAM_ENABLED, TWITTER_ENABLED, DEPOSIT_THRESHOLD, TESTNET } from '../secrets'
import fromBigNumber from '../utils/fromBigNumber'
import { Client } from 'discord.js'
import { PostDiscord } from '../integrations/discord'
import { GetEns } from '../integrations/ens'
import { GetNotableAddress } from '../utils/notableAddresses'
import { toDate } from '../utils/utils'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { SendTweet } from '../integrations/twitter'
import { Event as GenericEvent } from 'ethers'
import { TwitterApi } from 'twitter-api-v2'
import { DEPOSITS_CHANNEL } from '../constants/discordChannels'
import Lyra, { LiquidityPool__factory } from '@lyrafinance/lyra-js'
import {
  DepositProcessedEvent,
  DepositQueuedEvent,
} from '@lyrafinance/lyra-js/dist/types/contracts/typechain/LiquidityPool'
import { DepositDto } from '../types/lyra'
import { DepositDiscord, DepositTwitter } from '../templates/deposit'
import printObject from '../utils/printObject'
import { GetMarket } from '../templates/common'

export async function TrackDeposits(
  discordClient: Client<boolean>,
  discordClientBtc: Client<boolean>,
  discordClientSol: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient: TwitterApi,
  rpcClient: Lyra,
  genericEvent: GenericEvent,
  isQueued: boolean,
): Promise<void> {
  const market = GetMarket(genericEvent.address)
  let value = 0
  let amount = 0
  let from = ''
  let to = ''
  let fromAddress = ''
  let toAddress = ''
  let fromEns = ''
  let totalQueued = 0
  let transactionHash = ''
  let timestamp: Date
  let blockNumber = 0

  if (!isQueued) {
    const event = parseProcessedEvent(genericEvent as DepositProcessedEvent)
    amount = fromBigNumber(event.args.amountDeposited)
    value = amount
    from = GetNotableAddress(event.args.beneficiary)
    fromAddress = event.args.beneficiary
    fromEns = await GetEns(event.args.beneficiary)
    to = GetNotableAddress(event.address)
    toAddress = event.address
    transactionHash = event.transactionHash
    timestamp = toDate(fromBigNumber(event.args.timestamp))
    blockNumber = event.blockNumber
  } else {
    const event = parseEvent(genericEvent as DepositQueuedEvent)
    amount = fromBigNumber(event.args.amountDeposited)
    value = amount
    from = GetNotableAddress(event.args.depositor)
    fromAddress = event.args.depositor
    fromEns = await GetEns(event.args.depositor)
    totalQueued = fromBigNumber(event.args.totalQueuedDeposits)
    to = GetNotableAddress(event.address)
    toAddress = event.address
    transactionHash = event.transactionHash
    timestamp = toDate(fromBigNumber(event.args.timestamp))
    blockNumber = event.blockNumber
  }

  console.log(`Deposit Value: ${value}, threshold: ${DEPOSIT_THRESHOLD}`)

  if (value >= DEPOSIT_THRESHOLD) {
    try {
      const dto: DepositDto = {
        market: market,
        from: from === '' ? fromAddress : from,
        to: to === '' ? toAddress : to,
        amount: amount,
        transactionHash: transactionHash,
        fromEns: fromEns,
        blockNumber: blockNumber,
        value: value,
        notableTo: to !== '',
        notableFrom: from !== '',
        fromAddress: fromAddress,
        toAddress: toAddress,
        totalQueued: totalQueued,
      }
      await BroadCastDeposit(dto, discordClient, discordClientBtc, discordClientSol, telegramClient, twitterClient)
    } catch (ex) {
      console.log(ex)
    }
  } else {
    console.log(`Deposit less than $${DEPOSIT_THRESHOLD} threshold value`)
  }
}

export async function BroadCastDeposit(
  dto: DepositDto,
  discordClient: Client<boolean>,
  discordClientBtc: Client<boolean>,
  discordClientSol: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient: TwitterApi,
): Promise<void> {
  if (DISCORD_ENABLED) {
    const post = DepositDiscord(dto)

    if (dto.market.toLowerCase() === 'eth') {
      await PostDiscord(post, discordClient, DEPOSITS_CHANNEL)
    }
    if (dto.market.toLowerCase() == 'btc') {
      await PostDiscord(post, discordClientBtc, DEPOSITS_CHANNEL)
    }
    if (dto.market.toLowerCase() == 'sol') {
      await PostDiscord(post, discordClientSol, DEPOSITS_CHANNEL)
    }
  }

  if (TWITTER_ENABLED) {
    const post = DepositTwitter(dto)
    await SendTweet(post, twitterClient)
  }
}

export function parseEvent(event: DepositQueuedEvent): DepositQueuedEvent {
  const parsedEvent = LiquidityPool__factory.createInterface().parseLog(event)

  if ((parsedEvent.args as DepositQueuedEvent['args']).length > 0) {
    event.args = parsedEvent.args as DepositQueuedEvent['args']
  }
  return event
}

export function parseProcessedEvent(event: DepositProcessedEvent): DepositProcessedEvent {
  const parsedEvent = LiquidityPool__factory.createInterface().parseLog(event)

  if ((parsedEvent.args as DepositProcessedEvent['args']).length > 0) {
    event.args = parsedEvent.args as DepositProcessedEvent['args']
  }
  return event
}
