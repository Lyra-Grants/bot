import { GetLyraInfo } from '../integrations/coingecko'
import { LyraDto } from '../types/lyraDto'
import { Client } from 'discord.js'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TwitterApi } from 'twitter-api-v2'
import { PostDiscord } from '../integrations/discord'
import { SendTweet } from '../integrations/twitter'
import { DISCORD_ENABLED, TWITTER_ENABLED } from '../secrets'
import { TOKEN_CHANNEL } from '../constants/discordChannels'
import { CoinGeckoDiscord, CoinGeckoTwitter } from '../templates/coingecko'

export async function GetCoinGecko(): Promise<LyraDto> {
  return (await GetLyraInfo()) as LyraDto
}

export async function BroadcastCoinGecko(
  discordClient: Client<boolean>,
  twitterClient: TwitterApi,
  telegramClient: Telegraf<Context<Update>>,
  lyraDto: LyraDto,
) {
  if (DISCORD_ENABLED) {
    const embeds = CoinGeckoDiscord(lyraDto)
    await PostDiscord(embeds, discordClient, TOKEN_CHANNEL)
  }
  if (TWITTER_ENABLED) {
    const post = CoinGeckoTwitter(lyraDto)
    await SendTweet(post, twitterClient)
  }
}
