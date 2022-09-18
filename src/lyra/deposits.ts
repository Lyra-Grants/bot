import { DISCORD_ENABLED, TELEGRAM_ENABLED, TWITTER_ENABLED, DEPOSIT_THRESHOLD } from '../secrets'
import fromBigNumber from '../utils/fromBigNumber'
import { Client } from 'discord.js'
import { PostDiscord } from '../integrations/discord'
import { GetEns } from '../integrations/ens'
import { GetNotableAddress } from '../utils/notableAddresses'
import { toDate } from '../utils/utils'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { SendTweet } from '../integrations/twitter'
import Lyra from '@lyrafinance/lyra-js/dist/types/lyra'
import { Event as GenericEvent } from 'ethers'
import { TwitterApi } from 'twitter-api-v2'
import { DEPOSITS_CHANNEL } from '../constants/discordChannels'
import { LiquidityPool__factory } from '@lyrafinance/lyra-js'
import { DepositQueuedEvent } from '@lyrafinance/lyra-js/dist/types/contracts/typechain/LiquidityPool'
import { DepositDto } from '../types/lyra'
import { DepositDiscord, DepositTwitter } from '../templates/deposit'
import { RandomDegen } from '../constants/degenMessage'
import { ETH_LIQUIDITY_POOL } from '../constants/contractAddresses'
import printObject from '../utils/printObject'

export async function TrackDeposits(
  discordClient: Client<boolean>,
  discordClientBtc: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient: TwitterApi,
  lyra: Lyra,
  genericEvent: GenericEvent,
): Promise<void> {
  const event = parseEvent(genericEvent as DepositQueuedEvent)
  const amount = fromBigNumber(event.args.amountDeposited)
  const value = amount

  console.log(`Queued Deposit Value: ${value}`)

  if (value >= DEPOSIT_THRESHOLD) {
    try {
      const from = GetNotableAddress(event.args.depositor)
      const to = GetNotableAddress(event.address)
      const fromEns = await GetEns(event.args.depositor)
      const toEns = await GetEns(event.address)

      const dto: DepositDto = {
        market: event.address.toLowerCase() === ETH_LIQUIDITY_POOL ? 'Eth' : 'BTC',
        from: from === '' ? event.args.depositor : from,
        to: to === '' ? event.args.beneficiary : to,
        amount: amount,
        transactionHash: event.transactionHash,
        fromEns: fromEns,
        toEns: toEns,
        timestamp: toDate(fromBigNumber(event.args.timestamp)),
        blockNumber: event.blockNumber,
        value: value,
        notableTo: to !== '',
        notableFrom: from !== '',
        fromAddress: event.args.depositor,
        toAddress: event.address,
        totalQueued: fromBigNumber(event.args.totalQueuedDeposits),
        degenMessage: RandomDegen(),
      }
      BroadCastDeposit(dto, discordClient, discordClientBtc, telegramClient, twitterClient)
    } catch (ex) {
      console.log(ex)
    }
  } else {
    console.log(`Queued Deposit less than $${DEPOSIT_THRESHOLD} threshold value`)
  }
}

export async function BroadCastDeposit(
  dto: DepositDto,
  discordClient: Client<boolean>,
  discordClientBtc: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient: TwitterApi,
): Promise<void> {
  if (DISCORD_ENABLED) {
    const post = DepositDiscord(dto)
    //printObject(post)
    if (dto.market === 'Eth') {
      await PostDiscord(post, discordClient, DEPOSITS_CHANNEL)
    } else {
      await PostDiscord(post, discordClientBtc, DEPOSITS_CHANNEL)
    }
  }

  if (TWITTER_ENABLED) {
    const post = DepositTwitter(dto, false)
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
