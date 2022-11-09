import { RunTradeBot } from './lyra/trades'
import { GetLeaderBoard } from './lyra/leaderboard'
import {
  DISCORD_ACCESS_TOKEN,
  DISCORD_ACCESS_TOKEN_BTC,
  DISCORD_ACCESS_TOKEN_SOL,
  TELEGRAM_ENABLED,
  TESTNET,
  TWITTER_ENABLED,
} from './secrets'
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

let discordClient: Client<boolean>
let discordClientBtc: Client<boolean>
let discordClientSol: Client<boolean>
let twitterClient: TwitterApi
let twitterClient1: TwitterApi
let telegramClient: Telegraf<Context<Update>>
let lyra: Lyra

export async function initializeLyraBot() {
  lyra = new Lyra({
    provider: alchemyProvider,
  })

  global.LYRA_ENS = {}
  global.LYRA_LEADERBOARD = []
  global.FREN = {}

  await Promise.all([
    SetUpDiscord((discordClient = DiscordClient()), 'eth', DISCORD_ACCESS_TOKEN, lyra),
    SetUpDiscord((discordClientBtc = DiscordClient()), 'btc', DISCORD_ACCESS_TOKEN_BTC, lyra),
    SetUpDiscord((discordClientSol = DiscordClient()), 'sol', DISCORD_ACCESS_TOKEN_SOL, lyra),
    SetUpTwitter(),
    SetUpTelegram(),
    GetLeaderBoard(lyra),
    GetPrice(),
  ])

  await RunTradeBot(discordClient, discordClientBtc, discordClientSol, twitterClient, telegramClient, lyra)
  await TrackEvents(
    discordClient,
    discordClientBtc,
    discordClientSol,
    telegramClient,
    twitterClient,
    twitterClient1,
    lyra,
  )

  if (!TESTNET) {
    PricingJob(discordClient, discordClientBtc, discordClientSol)
    LeaderBoardFillJob(lyra)
    LeaderboardSendJob(discordClient, twitterClient, telegramClient, lyra)
    StatsJob(discordClient, discordClientBtc, discordClientSol, twitterClient, telegramClient, lyra)
    CoinGeckoJob(discordClient, twitterClient1, telegramClient, lyra)
    ArbitrageJob(discordClient, discordClientBtc, discordClientSol, twitterClient, telegramClient, lyra)
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
