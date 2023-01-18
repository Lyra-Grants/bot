import { DISCORD_ENABLED, TELEGRAM_ENABLED, TWITTER_ENABLED } from '../secrets'
import fromBigNumber from '../utils/fromBigNumber'
import { Client } from 'discord.js'
import { BoardDto, StrikeDto } from '../types/lyra'
import { groupBy, toDate } from '../utils/utils'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { SendTweet } from '../integrations/twitter'
import Lyra from '@lyrafinance/lyra-js/dist/types/lyra'
import { Event as GenericEvent } from 'ethers'
import { TwitterApi } from 'twitter-api-v2'
import { EXPIRY_CHANNEL } from '../constants/discordChannels'
import { OptionMarket__factory } from '@lyrafinance/lyra-js/dist/types/contracts/avalon/typechain/'
import { StrikeAddedEvent } from '@lyrafinance/lyra-js/dist/types/contracts/avalon/typechain/OptionMarket'
import printObject from '../utils/printObject'
import { BoardDiscord, BoardTelegram, BoardTwitter } from '../templates/strike'
import { PostDiscord } from '../integrations/discord'
import { PostTelegram } from '../integrations/telegram'

export async function TrackStrikeAdded(
  discordClient: Client<boolean>,
  discordClientBtc: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient: TwitterApi,
  lyra: Lyra,
  genericEvents: GenericEvent[],
): Promise<void> {
  const events = parseEvents(genericEvents as StrikeAddedEvent[])
  const boardEvents = groupBy(events, (i) => i.args.boardId.toNumber() as unknown as string)

  Object.keys(boardEvents).map(
    async (x) =>
      await processBoardStrikes(discordClient, discordClientBtc, telegramClient, twitterClient, boardEvents[x], lyra),
  )
}
export async function processBoardStrikes(
  discordClient: Client<boolean>,
  discordClientBtc: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient: TwitterApi,
  events: StrikeAddedEvent[],
  lyra: Lyra,
) {
  const board = await lyra.board(events[0].address, events[0].args.boardId.toNumber())
  const event = events[0]

  const boardDto: BoardDto = {
    blockNumber: event.blockNumber,
    transactionHash: event.transactionHash,
    expiry: toDate(board.expiryTimestamp),
    expiryString: board.expiryTimestamp as unknown as string,
    market: board.market().name,
    strikes: events.map((event) => {
      const dto: StrikeDto = {
        strikeId: event.args.strikeId.toNumber(),
        strikePrice: fromBigNumber(event.args.strikePrice),
        skew: fromBigNumber(event.args.skew),
      }
      return dto
    }),
  }

  try {
    BroadCastStrike(boardDto, discordClient, discordClientBtc, telegramClient, twitterClient)
  } catch (ex) {
    console.log(ex)
  }
}

export async function BroadCastStrike(
  dto: BoardDto,
  discordClient: Client<boolean>,
  discordClientBtc: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient: TwitterApi,
): Promise<void> {
  if (DISCORD_ENABLED) {
    const post = BoardDiscord(dto)
    if (dto.market.toLowerCase() === 'eth') {
      await PostDiscord(post, discordClient, EXPIRY_CHANNEL)
    }
    if (dto.market.toLowerCase() == 'btc') {
      await PostDiscord(post, discordClientBtc, EXPIRY_CHANNEL)
    }
  }

  if (TELEGRAM_ENABLED) {
    const post = BoardTelegram(dto)
    await PostTelegram(post, telegramClient)
  }

  if (TWITTER_ENABLED) {
    const post = BoardTwitter(dto)
    await SendTweet(post, twitterClient)
  }
}

export function parseEvents(events: StrikeAddedEvent[]): StrikeAddedEvent[] {
  const result = events.map((x) => {
    const parsedEvent = OptionMarket__factory.createInterface().parseLog(x)

    if ((parsedEvent.args as StrikeAddedEvent['args']).length > 0) {
      x.args = parsedEvent.args as StrikeAddedEvent['args']
    }
    return x
  })
  return result
}
