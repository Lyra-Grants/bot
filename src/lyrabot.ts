import { RunTradeBot } from './lyra/trades'
import { BroadcastLeaderBoard, GetLeaderBoard } from './lyra/leaderboard'
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
import { Job, scheduleJob } from 'node-schedule'
import { shortAddress } from './utils/utils'

let discordClient: Client<boolean>
let twitterClient: TwitterApi
let telegramClient: Telegraf<Context<Update>>

export async function initializeLyraBot() {
  SetUpDiscord()
  SetUpTwitter()
  SetUpTelegram()
  global.LYRA_ENS = {}
  global.LYRA_LEADERBOARD = await GetLeaderBoard(25)
  await RunTradeBot(discordClient, twitterClient, telegramClient)
  // update every 12 hours
  const job: Job = scheduleJob('0 0,12 * * *', async () => {
    console.log('Getting leader board')
    global.LYRA_LEADERBOARD = await GetLeaderBoard(25)
    await BroadcastLeaderBoard(discordClient, twitterClient, telegramClient)
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
