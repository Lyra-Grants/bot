import { RunTradeBot } from './lyra/trades'
import { BroadcastLeaderBoard, GetLeaderBoard } from './lyra/leaderboard'
import { DISCORD_ACCESS_TOKEN, DISCORD_ENABLED, TELEGRAM_ENABLED, TESTNET, TWITTER_ENABLED } from './utils/secrets'
import { DiscordClient } from './clients/discordClient'
import { Client } from 'discord.js'
import { TwitterApi } from 'twitter-api-v2'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { defaultActivity } from './integrations/discord'
import { TwitterClient } from './clients/twitterClient'
import { TelegramClient } from './clients/telegramClient'
import { Job, scheduleJob } from 'node-schedule'
import Lyra, { Deployment } from '@lyrafinance/lyra-js'
import { maketrade } from './actions/maketrade'
import { ethers } from 'ethers'
import { TestWallet } from './wallets/wallet'
import faucet from './actions/faucet'

let discordClient: Client<boolean>
let twitterClient: TwitterApi
let telegramClient: Telegraf<Context<Update>>
let lyraClient: Lyra

export async function initializeLyraBot() {
  let deployment: Deployment
  if (TESTNET) {
    deployment = Deployment.Kovan
  } else {
    deployment = Deployment.Mainnet
  }
  lyraClient = new Lyra(deployment)

  //const signer = new ethers.Wallet(TestWallet().privateKey, lyraClient.provider)
  //faucet(lyraClient, signer)
  //maketrade(lyraClient, signer)

  await SetUpDiscord()
  await SetUpTwitter()
  await SetUpTelegram()
  global.LYRA_ENS = {}
  global.LYRA_LEADERBOARD = await GetLeaderBoard(25)

  await RunTradeBot(discordClient, twitterClient, telegramClient, lyraClient)

  // every three days
  const job: Job = scheduleJob('0 0 */3 * *', async () => {
    global.LYRA_LEADERBOARD = await GetLeaderBoard(25)
    await BroadcastLeaderBoard(discordClient, twitterClient, telegramClient)
  })
}

export async function SetUpDiscord() {
  if (DISCORD_ENABLED) {
    discordClient = DiscordClient
    discordClient.on('ready', async (client) => {
      console.debug('Discord bot is online!')
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
