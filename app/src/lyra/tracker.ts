import { DISCORD_ENABLED, TOKEN_THRESHOLD, TWITTER_ENABLED } from '../secrets'
import fromBigNumber from '../utils/fromBigNumber'
import { Client } from 'discord.js'
import { TransferDto } from '../types/lyra'
import { PostDiscord } from '../integrations/discord'
import { TransferDiscord, TransferTwitter } from '../templates/transfer'
import { GetEns } from '../integrations/ens'
import { GetNotableAddress } from '../utils/notableAddresses'
import { Context, Telegraf } from 'telegraf'
import { SendTweet } from '../integrations/twitter'
import Lyra, { ERC20__factory } from '@lyrafinance/lyra-js'
import { Event as GenericEvent } from 'ethers'
import { TwitterApi } from 'twitter-api-v2'
import { TOKEN_CHANNEL } from '../constants/discordChannels'
import { TransferEvent } from '@lyrafinance/lyra-js/src/contracts/common/typechain/ERC20'

export async function TrackTransfer(
  discordClient: Client<boolean>,
  telegramClient: Telegraf,
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
  telegramClient: Telegraf,
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
