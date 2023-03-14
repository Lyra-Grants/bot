import { RunTradeBot } from './lyra/trades'
import { FetchLeaderBoard, GetLeaderBoard } from './lyra/leaderboard'
import { DISCORD_ACCESS_TOKEN, DISCORD_ACCESS_TOKEN_BTC, TELEGRAM_ENABLED, TESTNET, TWITTER_ENABLED } from './secrets'
import { DiscordClient } from './clients/discordClient'
import { Client } from 'discord.js'
import { TwitterApi } from 'twitter-api-v2'
import { Telegraf } from 'telegraf'
import { TwitterClient, TwitterClient1 } from './clients/twitterClient'
import { TelegramClient } from './clients/telegramClient'
import { Network } from '@lyrafinance/lyra-js'
import { GetPrice } from './integrations/coingecko'
import { TrackEvents } from './event/blockEvent'
import { ArbitrageJob, CoinGeckoJob, LeaderBoardFillJob, LeaderboardSendJob, PricingJob, StatsJob } from './schedule'
import { SetUpDiscord } from './discord'
import printObject from './utils/printObject'
import getLyraSDK from './utils/getLyraSDK'

let discordClient: Client<boolean>
let discordClientBtc: Client<boolean>
let twitterClient: TwitterApi
let twitterClient1: TwitterApi
let telegramClient: Telegraf

const networks = [Network.Optimism, Network.Arbitrum]

export async function Run() {
  global.LYRA_ENS = {}
  global.LEADERBOARD_OPT = []
  global.LEADERBOARD_ARB = []
  global.FREN = {}
  global.LYRA_ARB = getLyraSDK(Network.Arbitrum)
  global.LYRA_OPT = getLyraSDK(Network.Optimism)

  await GetPrice()

  // set up the clients
  await Promise.all([
    SetUpDiscord((discordClient = DiscordClient()), 'eth', DISCORD_ACCESS_TOKEN),
    SetUpDiscord((discordClientBtc = DiscordClient()), 'btc', DISCORD_ACCESS_TOKEN_BTC),
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
    PricingJob(discordClient, discordClientBtc)
    LeaderBoardFillJob()
    LeaderboardSendJob(discordClient, twitterClient, telegramClient, networks)
    StatsJob(discordClient, discordClientBtc, twitterClient, telegramClient, networks)
    CoinGeckoJob(discordClient, twitterClient1, telegramClient, networks[0])
    ArbitrageJob(discordClient, discordClientBtc, twitterClient, telegramClient, networks)
  }
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
