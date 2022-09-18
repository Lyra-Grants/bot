import { AttachmentBuilder, Client, EmbedBuilder } from 'discord.js'
import { Telegraf, Context } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TwitterApi } from 'twitter-api-v2'
import { ARBS_CHANNEL } from '../constants/discordChannels'
import { EventType } from '../constants/eventType'
import { PostDiscord } from '../integrations/discord'
import { PostTelegram } from '../integrations/telegram'
import { SendTweet } from '../integrations/twitter'
import { TWITTER_ENABLED, TESTNET, DISCORD_ENABLED, TELEGRAM_ENABLED } from '../secrets'
import { ArbDiscord, ArbTelegram, ArbTwitter } from '../templates/arb'
import { ArbDto, BaseEvent } from '../types/lyra'
import printObject from '../utils/printObject'

export async function BroadCast<T extends BaseEvent>(
  dto: T,
  twitterClient: TwitterApi,
  telegramClient: Telegraf<Context<Update>>,
  discordClient: Client<boolean>,
): Promise<void> {
  if (TWITTER_ENABLED) {
    let post = ''
    if (dto.eventType == EventType.Arb) {
      post = ArbTwitter(dto as unknown as ArbDto)
    }
    if (TESTNET) {
      console.log(post)
    } else {
      if (post != '') {
        await SendTweet(post, twitterClient)
      }
    }
  }

  if (TELEGRAM_ENABLED) {
    let post = ''
    if (dto.eventType == EventType.Arb) {
      post = ArbTelegram(dto as unknown as ArbDto)
    }
    if (TESTNET) {
      console.log(post)
    } else {
      if (post != '') {
        await PostTelegram(post, telegramClient)
      }
    }
  }

  if (DISCORD_ENABLED) {
    let embed: EmbedBuilder[] = []
    const att: AttachmentBuilder[] = []

    if (dto.eventType == EventType.Arb) {
      embed = ArbDiscord(dto as unknown as ArbDto)
    }

    if (TESTNET) {
      printObject(embed)
    } else {
      if (embed.length > 0) {
        let channel = ''

        if (dto.eventType == EventType.Arb) {
          channel = ARBS_CHANNEL
        }

        await PostDiscord(embed, discordClient, channel)
      }
    }
  }
}
