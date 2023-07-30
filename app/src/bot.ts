import { RunTradeBot } from './lyra/trades'
import { FetchLeaderBoard } from './lyra/leaderboard'
import {
  DISCORD_ACCESS_TOKEN_ARB,
  DISCORD_ACCESS_TOKEN_BTC,
  DISCORD_ACCESS_TOKEN_ETH,
  DISCORD_ACCESS_TOKEN_LYRA,
  DISCORD_ACCESS_TOKEN_OP,
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
import { ArbitrageJob, LeaderBoardFillJob, LeaderboardSendJob, OneMinuteJob, StatsJob } from './schedule'
import { SetUpDiscord } from './discord'
import getLyraSDK from './utils/getLyraSDK'

let discordClientEth: Client
let discordClientBtc: Client
let discordClientLyra: Client
let discordClientArb: Client
let discordClientOp: Client

let twitterClient: TwitterApi
let twitterClient1: TwitterApi
let telegramClient: Telegraf

const networks = [Network.Arbitrum, Network.Optimism] // Network.Arbitrum]

export async function Run() {
  InitVariables()

  const pairs = await GetPrices()
  global.PRICES = pairs

  // set up the clients
  await Promise.all([
    SetUpDiscord((discordClientEth = DiscordClient()), 'eth', DISCORD_ACCESS_TOKEN_ETH),
    SetUpDiscord((discordClientBtc = DiscordClient()), 'btc', DISCORD_ACCESS_TOKEN_BTC),
    SetUpDiscord((discordClientArb = DiscordClient()), 'arb', DISCORD_ACCESS_TOKEN_ARB),
    SetUpDiscord((discordClientOp = DiscordClient()), 'op', DISCORD_ACCESS_TOKEN_OP),
    SetUpDiscord((discordClientLyra = DiscordClient()), 'lyra', DISCORD_ACCESS_TOKEN_LYRA),
    SetUpTwitter(),
    SetUpTelegram(),
    FetchLeaderBoard(),
  ])

  //listen to events
  networks.map(async (network) => {
    await runBot(network)
  })
  OneMinuteJob(discordClientEth, discordClientBtc, discordClientOp, discordClientArb, discordClientLyra)
  // periodic jobs
  if (!TESTNET) {
    LeaderBoardFillJob()
    LeaderboardSendJob(discordClientLyra, twitterClient, telegramClient, networks)
    StatsJob(discordClientLyra, twitterClient, telegramClient, networks)
    ArbitrageJob(discordClientLyra, twitterClient, telegramClient, networks)
  }
}

function InitVariables() {
  global.LYRA_ENS = {}
  global.LEADERBOARD_OPT = []
  global.LEADERBOARD_ARB = []
  global.PRICES = []
  global.FREN = {}
  global.LYRA_ARB = getLyraSDK(Network.Arbitrum)
  global.LYRA_OPT = getLyraSDK(Network.Optimism)
}

export async function runBot(network: Network) {
  await RunTradeBot(discordClientLyra, twitterClient, telegramClient, network)
  await TrackEvents(discordClientLyra, telegramClient, twitterClient, twitterClient1, network)
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
