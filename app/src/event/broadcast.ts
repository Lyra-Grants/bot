import { AttachmentBuilder, Client, EmbedBuilder } from 'discord.js'
import { Telegraf, Context } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TwitterApi } from 'twitter-api-v2'
import { ARBS_CHANNEL, TOKEN_CHANNEL } from '../constants/discordChannels'
import { EventType } from '../constants/eventType'
import { PostDiscord } from '../integrations/discord'
import { PostTelegram } from '../integrations/telegram'
import { SendTweet } from '../integrations/twitter'
import { TWITTER_ENABLED, TESTNET, DISCORD_ENABLED, TELEGRAM_ENABLED } from '../secrets'
import { ArbDiscord, ArbTelegram, ArbTwitter } from '../templates/arb'
import { CoinGeckoDiscord, CoinGeckoTwitter } from '../templates/coingecko'
import { ArbDto, BaseEvent, LyraDto } from '../types/lyra'

export async function BroadCast<T extends BaseEvent>(
  dto: T,
  twitterClient: TwitterApi,
  telegramClient: Telegraf<Context<Update>>,
  discordClient: Client<boolean>,
): Promise<void> {
  if (TWITTER_ENABLED) {
    let post = ''
    if (dto.eventType == EventType.Arb) {
      const arbDto = dto as unknown as ArbDto
      if (arbDto.arbs.length > 0) {
        post = ArbTwitter(dto as unknown as ArbDto)
      }
    }
    if (dto.eventType == EventType.CoinGecko) {
      post = CoinGeckoTwitter(dto as unknown as LyraDto)
    }
    if (post != '') {
      await SendTweet(post, twitterClient)
    }
  }

  if (TELEGRAM_ENABLED) {
    let post = ''
    if (dto.eventType == EventType.Arb) {
      const arbDto = dto as unknown as ArbDto
      if (arbDto.arbs.length > 0) {
        post = ArbTelegram(dto as unknown as ArbDto)
      }
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
    let channel = ''

    if (dto.eventType == EventType.Arb) {
      const arbDto = dto as unknown as ArbDto
      if (arbDto.arbs.length > 0) {
        embed = ArbDiscord(dto as unknown as ArbDto)
      }
      channel = ARBS_CHANNEL
    }
    if (dto.eventType == EventType.CoinGecko) {
      embed = CoinGeckoDiscord(dto as unknown as LyraDto)
      channel = TOKEN_CHANNEL
    }

    if (embed.length > 0 && channel != '') {
      await PostDiscord(embed, discordClient, channel)
    }
  }
}
