import { DISCORD_ENABLED, TELEGRAM_ENABLED, TWITTER_ENABLED, DEPOSIT_THRESHOLD, TESTNET } from '../secrets'
import fromBigNumber from '../utils/fromBigNumber'
import { Client } from 'discord.js'
import { PostDiscord } from '../integrations/discord'
import { GetEns } from '../integrations/ens'
import { GetNotableAddress } from '../utils/notableAddresses'
import { Telegraf } from 'telegraf'
import { SendTweet } from '../integrations/twitter'
import { Event as GenericEvent } from 'ethers'
import { TwitterApi } from 'twitter-api-v2'
import { DEPOSITS_CHANNEL } from '../constants/discordChannels'
import Lyra, { AvalonLiquidityPool__factory, DepositQueuedOrProcessedEvent } from '@lyrafinance/lyra-js'
import { DepositDto } from '../types/lyra'
import { DepositDiscord, DepositTwitter } from '../templates/deposit'
import { GetMarket } from '../templates/common'
import { GetUrl } from '../utils/utils'
import { DepositProcessedEvent, DepositQueuedEvent } from '@lyrafinance/lyra-js/src/constants/events'

export async function TrackDeposits(
  discordClient: Client<boolean>,
  discordClientBtc: Client<boolean>,
  telegramClient: Telegraf,
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
      await BroadCastDeposit(dto, discordClient, discordClientBtc, telegramClient, twitterClient)
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
  telegramClient: Telegraf,
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
  }

  if (TWITTER_ENABLED) {
    const post = DepositTwitter(dto)
    await SendTweet(post, twitterClient)
  }
}

export function parseEvent(event: DepositQueuedEvent): DepositQueuedEvent {
  const parsedEvent = AvalonLiquidityPool__factory.createInterface().parseLog(event)

  if ((parsedEvent.args as DepositQueuedEvent['args']).length > 0) {
    event.args = parsedEvent.args as DepositQueuedEvent['args']
  }
  return event
}

export function parseProcessedEvent(event: DepositProcessedEvent): DepositProcessedEvent {
  const parsedEvent = AvalonLiquidityPool__factory.createInterface().parseLog(event)

  if ((parsedEvent.args as DepositProcessedEvent['args']).length > 0) {
    event.args = parsedEvent.args as DepositProcessedEvent['args']
  }
  return event
}
