import { DISCORD_ENABLED, TELEGRAM_ENABLED, TWITTER_ENABLED, DEPOSIT_THRESHOLD, TESTNET } from '../secrets'
import fromBigNumber from '../utils/fromBigNumber'
import { Client } from 'discord.js'
import { PostDiscord } from '../integrations/discord'
import { GetEns } from '../integrations/ens'
import { GetNotableAddress } from '../utils/notableAddresses'
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
import { GetMarket } from '../templates/common'
import { GetUrl } from '../utils/utils'

export async function TrackDeposits(
  discordClient: Client<boolean>,
  discordClientBtc: Client<boolean>,
  discordClientSol: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient: TwitterApi,
  rpcClient: Lyra,
  genericEvent: GenericEvent,
): Promise<void> {
  const market = GetMarket(genericEvent.address)
  const event = parseProcessedEvent(genericEvent as DepositProcessedEvent)
  const amount = fromBigNumber(event.args.amountDeposited)
  const value = amount
  const from = GetNotableAddress(event.args.beneficiary.toLowerCase())
  const fromAddress = event.args.beneficiary
  const fromEns = await GetEns(event.args.beneficiary.toLowerCase())
  const to = GetNotableAddress(event.address.toLowerCase())
  const toAddress = event.address.toLowerCase()
  const isNotable = from !== ''

  console.log(`Deposit Value: ${value}, threshold: ${DEPOSIT_THRESHOLD}`)

  if (value >= DEPOSIT_THRESHOLD) {
    try {
      const dto: DepositDto = {
        account: fromAddress,
        ens: fromEns,
        market: market,
        notableAddress: from,
        to: to === '' ? toAddress : to,
        amount: amount,
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        value: value,
        notableTo: to !== '',
        isNotable: isNotable,
        fromAddress: fromAddress,
        toAddress: toAddress,
        totalQueued: 0,
        url: GetUrl(event.args.beneficiary.toLowerCase(), isNotable),
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
