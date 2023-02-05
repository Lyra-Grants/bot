import { RunTradeBot } from './lyra/trades'
import { GetLeaderBoard } from './lyra/leaderboard'
import { DISCORD_ACCESS_TOKEN, DISCORD_ACCESS_TOKEN_BTC, TELEGRAM_ENABLED, TESTNET, TWITTER_ENABLED } from './secrets'
import { DiscordClient } from './clients/discordClient'
import { Client } from 'discord.js'
import { TwitterApi } from 'twitter-api-v2'
import { Telegraf } from 'telegraf'
import { TwitterClient, TwitterClient1 } from './clients/twitterClient'
import { TelegramClient } from './clients/telegramClient'
import Lyra, { Chain } from '@lyrafinance/lyra-js'
import { GetPrice } from './integrations/coingecko'
import { alchemyProvider } from './clients/ethersClient'
import { TrackEvents } from './event/blockEvent'
import { ArbitrageJob, CoinGeckoJob, LeaderBoardFillJob, LeaderboardSendJob, PricingJob, StatsJob } from './schedule'
import { SetUpDiscord } from './discord'
import printObject from './utils/printObject'
import getLyra from './utils/getLyra'

let discordClient: Client<boolean>
let discordClientBtc: Client<boolean>
let twitterClient: TwitterApi
let twitterClient1: TwitterApi
let telegramClient: Telegraf
let lyra: Lyra

// const chain = interaction.options.getString('chain') as Chain
const chains = [Chain.Optimism]

export async function Run() {
  global.LYRA_ENS = {}
  global.LEADERBOARD_DATA = []
  global.FREN = {}
  await GetPrice()

  // set up the clients
  await Promise.all([
    SetUpDiscord((discordClient = DiscordClient()), 'eth', DISCORD_ACCESS_TOKEN),
    SetUpDiscord((discordClientBtc = DiscordClient()), 'btc', DISCORD_ACCESS_TOKEN_BTC),
    SetUpTwitter(),
    SetUpTelegram(),
    GetLeaderBoard(),
  ])

  // listen to events
  chains.map(async (chain) => {
    await runBot(chain)
  })

  // periodic jobs
  if (!TESTNET) {
    PricingJob(discordClient, discordClientBtc)
    // LeaderBoardFillJob()
    // LeaderboardSendJob(discordClient, twitterClient, telegramClient)
    StatsJob(discordClient, discordClientBtc, twitterClient, telegramClient, chains)
    CoinGeckoJob(discordClient, twitterClient1, telegramClient)
    ArbitrageJob(discordClient, discordClientBtc, twitterClient, telegramClient, chains)
  }
}

export async function runBot(chain: Chain) {
  lyra = getLyra(chain)
  await RunTradeBot(discordClient, discordClientBtc, twitterClient, telegramClient, lyra)
  await TrackEvents(discordClient, discordClientBtc, telegramClient, twitterClient, twitterClient1, lyra)
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
