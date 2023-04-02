import { RunTradeBot } from './lyra/trades'
import { FetchLeaderBoard } from './lyra/leaderboard'
import {
  DISCORD_ACCESS_TOKEN,
  DISCORD_ACCESS_TOKEN_BTC,
  DISCORD_ACCESS_TOKEN_LYRA,
  TELEGRAM_ENABLED,
  TESTNET,
  TWITTER_ENABLED,
} from './config'
import { DiscordClient } from './clients/discordClient'
import { Client } from 'discord.js'
import { TwitterApi } from 'twitter-api-v2'
import { Telegraf } from 'telegraf'
import { TwitterClient, TwitterClient1 } from './clients/twitterClient'
import { TelegramClient } from './clients/telegramClient'
import { Network } from '@lyrafinance/lyra-js'
import { GetPrices } from './integrations/prices'
import { TrackEvents } from './event/blockEvent'
import { ArbitrageJob, LeaderBoardFillJob, LeaderboardSendJob, PricingJob, StatsJob } from './schedule'
import { SetUpDiscord } from './discord'
import printObject from './utils/printObject'
import getLyraSDK from './utils/getLyraSDK'

let discordClient: Client<boolean>
let discordClientBtc: Client<boolean>
let discordClientLyra: Client<boolean>

let twitterClient: TwitterApi
let twitterClient1: TwitterApi
let telegramClient: Telegraf

const networks = [Network.Optimism, Network.Arbitrum]

export async function Run() {
  InitVariables()

  await GetPrices()

  // set up the clients
  await Promise.all([
    SetUpDiscord((discordClient = DiscordClient()), 'eth', DISCORD_ACCESS_TOKEN),
    SetUpDiscord((discordClientBtc = DiscordClient()), 'btc', DISCORD_ACCESS_TOKEN_BTC),
    //SetUpDiscord((discordClientLyra = DiscordClient()), 'lyra', DISCORD_ACCESS_TOKEN_LYRA),
    SetUpTwitter(),
    SetUpTelegram(),
    FetchLeaderBoard(),
  ])

  //listen to events
  networks.map(async (network) => {
    await runBot(network)
  })

  // periodic jobs
  if (!TESTNET) {
    PricingJob(discordClient, discordClientBtc, discordClientLyra)
    LeaderBoardFillJob()
    LeaderboardSendJob(discordClient, twitterClient, telegramClient, networks)
    StatsJob(discordClient, discordClientBtc, twitterClient, telegramClient, networks)
    ArbitrageJob(discordClient, discordClientBtc, twitterClient, telegramClient, networks)
  }
}

function InitVariables() {
  global.LYRA_ENS = {}
  global.LEADERBOARD_OPT = []
  global.LEADERBOARD_ARB = []
  global.FREN = {}
  global.LYRA_ARB = getLyraSDK(Network.Arbitrum)
  global.LYRA_OPT = getLyraSDK(Network.Optimism)
  global.ETH_PRICE = 0
  global.ETH_24HR = 0
  global.BTC_PRICE = 0
  global.BTC_24HR = 0
  global.LYRA_PRICE = 0
  global.LYRA_24HR = 0
}

export async function runBot(network: Network) {
  await RunTradeBot(discordClient, discordClientBtc, twitterClient, telegramClient, network)
  await TrackEvents(discordClient, discordClientBtc, telegramClient, twitterClient, twitterClient1, network)
}

export async function SetUpTwitter() {
  if (TWITTER_ENABLED) {
    twitterClient = TwitterClient
    twitterClient.readWrite
    twitterClient1 = TwitterClient1
    twitterClient1.readWrite
  }
}

export async function SetUpTelegram() {
  if (TELEGRAM_ENABLED) {
    telegramClient = TelegramClient
  }
}
