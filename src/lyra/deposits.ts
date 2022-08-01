import {
  DISCORD_ENABLED,
  TOKEN_THRESHOLD,
  TELEGRAM_ENABLED,
  TESTNET,
  TWITTER_ENABLED,
  DEPOSIT_THRESHOLD,
} from '../secrets'
import fromBigNumber from '../utils/fromBigNumber'
import { Client } from 'discord.js'
import { TransferDto } from '../types/transferDto'
import { PostDiscord } from '../integrations/discord'
import { TransferDiscord, TransferTwitter } from '../templates/transfer'
import { GetEns } from '../integrations/ens'
import { GetNotableAddress } from '../utils/notableAddresses'
import { firstAddress, toDate } from '../utils/utils'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { PostTelegram } from '../integrations/telegram'
import { TwitterClient } from '../clients/twitterClient'
import { SendTweet } from '../integrations/twitter'
import Lyra from '@lyrafinance/lyra-js/dist/types/lyra'
import { Event as GenericEvent } from 'ethers'
import { TwitterApi } from 'twitter-api-v2'
import { DEPOSITS_CHANNEL, TOKEN_CHANNEL } from '../constants/discordChannels'
import { ERC20__factory, LiquidityPool__factory } from '@lyrafinance/lyra-js'
import { TransferEvent } from '@lyrafinance/lyra-js/dist/types/contracts/typechain/ERC20'
import { DepositQueuedEvent } from '@lyrafinance/lyra-js/dist/types/contracts/typechain/LiquidityPool'
import { DepositDto } from '../types/depositDto'
import { DepositDiscord, DepositTwitter } from '../templates/deposit'

export async function TrackDeposits(
  discordClient: Client<boolean>,
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
      }
      BroadCastDeposit(dto, discordClient, telegramClient, twitterClient)
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
  telegramClient: Telegraf<Context<Update>>,
  twitterClient: TwitterApi,
): Promise<void> {
  if (DISCORD_ENABLED) {
    //const post = DepositDiscord(dto)
    //await PostDiscord(post, discordClient, DEPOSITS_CHANNEL)
  }
  if (TELEGRAM_ENABLED) {
    // const post = TransferTelegram(transferDto)
    // await PostTelegram(post, telegramClient)
  }
  const post = DepositTwitter(dto)
  console.log(post)
  if (TWITTER_ENABLED) {
    const post = DepositTwitter(dto)
    console.log(post)
    // await SendTweet(post, twitterClient)
  }
}

export function parseEvent(event: DepositQueuedEvent): DepositQueuedEvent {
  const parsedEvent = LiquidityPool__factory.createInterface().parseLog(event)

  if ((parsedEvent.args as DepositQueuedEvent['args']).length > 0) {
    event.args = parsedEvent.args as DepositQueuedEvent['args']
  }
  return event
}
