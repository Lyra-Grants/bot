import { RunTradeBot } from './lyra/trades'
import { GetLeaderBoard } from './lyra/leaderboard'
import cron from 'node-cron'
import { DISCORD_ACCESS_TOKEN, DISCORD_ENABLED, TELEGRAM_ENABLED, TWITTER_ENABLED } from './utils/secrets'
import { DiscordClient } from './clients/discordClient'
import { Client } from 'discord.js'
import { TwitterApi } from 'twitter-api-v2'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { defaultActivity } from './integrations/discord'
import { TwitterClient } from './clients/twitterClient'
import { TelegramClient } from './clients/telegramClient'

let discordClient: Client<boolean>
let twitterClient: TwitterApi
let telegramClient: Telegraf<Context<Update>>

export async function initializeLyraBot() {
  SetUpDiscord()
  SetUpTwitter()
  SetUpTelegram()
  global.LYRA_ENS = {}
  global.LYRA_LEADERBOARD = await GetLeaderBoard(25)

  console.log(global.LYRA_LEADERBOARD)

  await RunTradeBot(discordClient, twitterClient, telegramClient)

  // schedule broadcasts
  cron.schedule('10 * * * * *', async () => {
    console.log('Getting leader board')
    global.LYRA_LEADERBOARD = await GetLeaderBoard(5)
    console.log(global.LYRA_LEADERBOARD.slice(0, 6))
  })
}

export async function SetUpDiscord() {
  if (DISCORD_ENABLED) {
    discordClient = DiscordClient
    discordClient.on('ready', async (client) => {
      console.log('Discord bot is online!')
    })

    await discordClient.login(DISCORD_ACCESS_TOKEN)
    defaultActivity(discordClient)
  }
}

export async function SetUpTwitter() {
  if (TWITTER_ENABLED) {
    twitterClient = TwitterClient
    twitterClient.readWrite
  }
}

export async function SetUpTelegram() {
  if (TELEGRAM_ENABLED) {
    telegramClient = TelegramClient
  }
}
