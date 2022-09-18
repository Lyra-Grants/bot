import { DISCORD_ENABLED, TOKEN_THRESHOLD, TELEGRAM_ENABLED, TESTNET, TWITTER_ENABLED } from '../secrets'
import fromBigNumber from '../utils/fromBigNumber'
import { Client } from 'discord.js'
import { TransferDto } from '../types/lyra'
import { PostDiscord } from '../integrations/discord'
import { TransferDiscord, TransferTwitter } from '../templates/transfer'
import { GetEns } from '../integrations/ens'
import { GetNotableAddress } from '../utils/notableAddresses'
import { toDate } from '../utils/utils'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { SendTweet } from '../integrations/twitter'
import Lyra from '@lyrafinance/lyra-js/dist/types/lyra'
import { Event as GenericEvent } from 'ethers'
import { TwitterApi } from 'twitter-api-v2'
import { TOKEN_CHANNEL } from '../constants/discordChannels'
import { ERC20__factory } from '@lyrafinance/lyra-js'
import { TransferEvent } from '@lyrafinance/lyra-js/dist/types/contracts/typechain/ERC20'

export async function TrackTransfer(
  discordClient: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient: TwitterApi,
  lyra: Lyra,
  genericEvent: GenericEvent,
): Promise<void> {
  const event = parseEvent(genericEvent as TransferEvent)
  const amount = fromBigNumber(event.args.value)
  const value = global.LYRA_PRICE * amount

  console.log(`Transfer Value: ${value}`)

  if (value >= TOKEN_THRESHOLD) {
    try {
      let timestamp = 0
      try {
        timestamp = (await lyra.provider.getBlock(event.blockNumber)).timestamp
      } catch (ex) {
        console.log(ex)
      }
      const from = GetNotableAddress(event.args.from)
      const to = GetNotableAddress(event.args.to)
      const fromEns = await GetEns(event.args.from)
      const toEns = await GetEns(event.args.to)

      const transferDto: TransferDto = {
        from: from === '' ? event.args.from : from,
        to: to === '' ? event.args.to : to,
        amount: amount,
        transactionHash: event.transactionHash,
        fromEns: fromEns,
        toEns: toEns,
        timestamp: timestamp === 0 ? toDate(Date.now()) : toDate(timestamp),
        blockNumber: event.blockNumber,
        value: value,
        notableTo: to !== '',
        notableFrom: from !== '',
        fromAddress: event.args.from,
        toAddress: event.args.to,
      }
      BroadCastTransfer(transferDto, discordClient, telegramClient, twitterClient)
    } catch (ex) {
      console.log(ex)
    }
  } else {
    console.log(`Transfer less than $${TOKEN_THRESHOLD} threshold value`)
  }
}

export async function BroadCastTransfer(
  transferDto: TransferDto,
  discordClient: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient: TwitterApi,
): Promise<void> {
  if (DISCORD_ENABLED) {
    const post = TransferDiscord(transferDto)
    await PostDiscord(post, discordClient, TOKEN_CHANNEL)
  }

  if (TWITTER_ENABLED) {
    const post = TransferTwitter(transferDto)
    await SendTweet(post, twitterClient)
  }
}

export function parseEvent(event: TransferEvent): TransferEvent {
  const parsedEvent = ERC20__factory.createInterface().parseLog(event)

  if ((parsedEvent.args as TransferEvent['args']).length > 0) {
    event.args = parsedEvent.args as TransferEvent['args']
  }
  return event
}
