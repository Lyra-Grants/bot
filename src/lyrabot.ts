import { RunTradeBot } from './lyra/trades'
import { BroadcastLeaderBoard, GetLeaderBoard } from './lyra/leaderboard'
import { DISCORD_ACCESS_TOKEN, DISCORD_ENABLED, TELEGRAM_ENABLED, TESTNET, TWITTER_ENABLED } from './secrets'
import { DiscordClient } from './clients/discordClient'
import { Client } from 'discord.js'
import { TwitterApi } from 'twitter-api-v2'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { defaultActivity, defaultName } from './integrations/discord'
import { TwitterClient } from './clients/twitterClient'
import { TelegramClient } from './clients/telegramClient'
import { Job, scheduleJob } from 'node-schedule'
import Lyra, { Deployment } from '@lyrafinance/lyra-js'
import { maketrade } from './actions/maketrade'
import { ethers } from 'ethers'
import { TestWallet } from './wallets/wallet'
import faucet from './actions/faucet'
import { LeaderboardDiscord, LeaderboardTelegram } from './utils/template'
import { TrackTokenMoves } from './token/tracker'
import { GetPrice } from './integrations/coingecko'
import { globalAgent } from 'http'

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

  if (TESTNET) {
    //const signer = new ethers.Wallet(TestWallet().privateKey, lyraClient.provider)
    //faucet(lyraClient, signer)
    //maketrade(lyraClient, signer)
  }
  global.ETH_24HR = 0
  global.ETH_PRICE = 0
  await GetPrice()
  await SetUpDiscord()
  await SetUpTwitter()
  await SetUpTelegram()

  global.LYRA_ENS = {}
  global.LYRA_LEADERBOARD = await GetLeaderBoard(30)

  await RunTradeBot(discordClient, twitterClient, telegramClient, lyraClient)
  //await TrackTokenMoves(discordClient, lyraClient)

  //Changing usernames in Discord is heavily rate limited, with only 2 requests every hour.
  const pricingJob: Job = scheduleJob('*/30 * * * *', async () => {
    GetPrice()
    defaultActivity(discordClient)
    defaultName(discordClient)
  })

  // Monday / Wednesday / Friday (as this resets each build)
  const leadeboardJob: Job = scheduleJob('0 0 * * 1,3,5', async () => {
    global.LYRA_LEADERBOARD = await GetLeaderBoard(30)
    await BroadcastLeaderBoard(discordClient, twitterClient, telegramClient)
  })
}

export async function SetUpDiscord() {
  if (DISCORD_ENABLED) {
    discordClient = DiscordClient
    discordClient.on('ready', async (client) => {
      console.debug('Discord bot is online!')
    })

    discordClient.on('interactionCreate', async (interaction) => {
      if (!interaction.isCommand()) return

      const { commandName } = interaction

      if (commandName === 'leaderboard') {
        global.LYRA_LEADERBOARD = await GetLeaderBoard(30)
        const post = LeaderboardDiscord(global.LYRA_LEADERBOARD.slice(0, 10))
        await interaction.reply({ embeds: post })
      }
      if (commandName === 'top30') {
        global.LYRA_LEADERBOARD = await GetLeaderBoard(30)
        const post = LeaderboardDiscord(global.LYRA_LEADERBOARD)
        await interaction.reply({ embeds: post })
      }
    })

    await discordClient.login(DISCORD_ACCESS_TOKEN)

    defaultActivity(discordClient)
    defaultName(discordClient)
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
