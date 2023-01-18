import { RunTradeBot } from './lyra/trades'
import { GetLeaderBoard } from './lyra/leaderboard'
import { DISCORD_ACCESS_TOKEN, DISCORD_ACCESS_TOKEN_BTC, TELEGRAM_ENABLED, TESTNET, TWITTER_ENABLED } from './secrets'
import { DiscordClient } from './clients/discordClient'
import { Client } from 'discord.js'
import { TwitterApi } from 'twitter-api-v2'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TwitterClient, TwitterClient1 } from './clients/twitterClient'
import { TelegramClient } from './clients/telegramClient'
import Lyra from '@lyrafinance/lyra-js'
import { GetPrice } from './integrations/coingecko'
import { alchemyProvider } from './clients/ethersClient'
import { TrackEvents } from './event/blockEvent'
import { ArbitrageJob, CoinGeckoJob, LeaderBoardFillJob, LeaderboardSendJob, PricingJob, StatsJob } from './schedule'
import { SetUpDiscord } from './discord'
import printObject from './utils/printObject'

let discordClient: Client<boolean>
let discordClientBtc: Client<boolean>
let twitterClient: TwitterApi
let twitterClient1: TwitterApi
let telegramClient: Telegraf<Context<Update>>
let lyra: Lyra

export async function initializeLyraBot() {
  lyra = new Lyra({
    provider: alchemyProvider,
    subgraphUri: 'https://subgraph.satsuma-prod.com/lyra/optimism-mainnet/api',
  })

  global.LYRA_ENS = {}
  global.LEADERBOARD_DATA = []
  global.FREN = {}
  await GetPrice()

  await Promise.all([
    SetUpDiscord((discordClient = DiscordClient()), 'eth', DISCORD_ACCESS_TOKEN, lyra),
    SetUpDiscord((discordClientBtc = DiscordClient()), 'btc', DISCORD_ACCESS_TOKEN_BTC, lyra),
    SetUpTwitter(),
    SetUpTelegram(),
    GetLeaderBoard(),
  ])

  await RunTradeBot(discordClient, discordClientBtc, twitterClient, telegramClient, lyra)
  await TrackEvents(discordClient, discordClientBtc, telegramClient, twitterClient, twitterClient1, lyra)

  if (!TESTNET) {
    PricingJob(discordClient, discordClientBtc)
    LeaderBoardFillJob()
    LeaderboardSendJob(discordClient, twitterClient, telegramClient)
    StatsJob(discordClient, discordClientBtc, twitterClient, telegramClient, lyra)
    CoinGeckoJob(discordClient, twitterClient1, telegramClient, lyra)
    ArbitrageJob(discordClient, discordClientBtc, twitterClient, telegramClient, lyra)
  }
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
