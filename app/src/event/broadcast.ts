import { Network } from '@lyrafinance/lyra-js'
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, Client, EmbedBuilder } from 'discord.js'
import { Telegraf } from 'telegraf'
import { TwitterApi } from 'twitter-api-v2'
import { ARBS_CHANNEL } from '../constants/discordChannels'
import { EventType } from '../constants/eventType'
import { PostDiscord } from '..//discord'
import { PostTelegram } from '../integrations/telegram'
import { SendTweet } from '../integrations/twitter'
import { TWITTER_ENABLED, TESTNET, DISCORD_ENABLED, TELEGRAM_ENABLED } from '../config'
import { ArbDiscord, ArbTelegram, ArbTwitter } from '../templates/arb'
import { ArbDto, BaseEvent } from '../types/lyra'

export async function BroadCast<T extends BaseEvent>(
  dto: T,
  twitterClient: TwitterApi,
  telegramClient: Telegraf,
  discordClient: Client,
  network: Network,
): Promise<void> {
  if (TWITTER_ENABLED) {
    let post = ''
    if (dto.eventType == EventType.Arb) {
      const arbDto = dto as unknown as ArbDto
      if (arbDto.arbs.length > 0) {
        post = ArbTwitter(dto as unknown as ArbDto, network)
      }
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
        post = ArbTelegram(dto as unknown as ArbDto, network)
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
    let embeds: EmbedBuilder[] = []
    let rows: ActionRowBuilder<ButtonBuilder>[] = []

    const att: AttachmentBuilder[] = []
    let channel = ''

    if (dto.eventType == EventType.Arb) {
      const arbDto = dto as unknown as ArbDto
      if (arbDto.arbs.length > 0) {
        ;({ embeds, rows } = ArbDiscord(dto as unknown as ArbDto, network))
      }
      channel = ARBS_CHANNEL
    }

    if (embeds.length > 0 && channel != '') {
      await PostDiscord(embeds, rows, discordClient, channel)
    }
  }
}
