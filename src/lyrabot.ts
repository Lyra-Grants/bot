import { RunTradeBot } from './lyra/trades'
import { GetLeaderBoard } from './lyra/leaderboard'
import { DISCORD_ACCESS_TOKEN, DISCORD_ENABLED, TELEGRAM_ENABLED, TESTNET, TWITTER_ENABLED } from './secrets'
import { DiscordClient } from './clients/discordClient'
import { Client, TextChannel } from 'discord.js'
import { TwitterApi } from 'twitter-api-v2'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { defaultActivity, defaultName } from './integrations/discord'
import { TwitterClient, TwitterClient1, TwitterClient2 } from './clients/twitterClient'
import { TelegramClient } from './clients/telegramClient'
import Lyra from '@lyrafinance/lyra-js'
import { maketrade } from './actions/maketrade'
import { ethers } from 'ethers'
import { TestWallet } from './wallets/wallet'
import faucet from './actions/faucet'
import { GetPrice } from './integrations/coingecko'
import { LeaderboardDiscord } from './templates/leaderboard'
import { GetStats } from './lyra/stats'
import { StatDiscord } from './templates/stats'
import {
  DEPOSITS_CHANNEL,
  STATS_CHANNEL,
  TOKEN_CHANNEL,
  TRADER_CHANNEL,
  TRADE_CHANNEL,
} from './constants/discordChannels'
import { HelpDiscord, QuantDiscord } from './templates/help'
import { optimismInfuraProvider } from './clients/ethersClient'
import { TrackEvents } from './event/blockEvent'
import { CoinGeckoDiscord, CoinGeckoTwitter } from './templates/coingecko'
import { GetCoinGecko } from './lyra/coingecko'
import { CoinGeckoJob, LeaderboardJob, PricingJob, StatsJob } from './schedule'
import { SendTweet } from './integrations/twitter'

let discordClient: Client<boolean>
let twitterClient: TwitterApi
let twitterClient1: TwitterApi
let twitterClient2: TwitterApi
let telegramClient: Telegraf<Context<Update>>
let lyraClient: Lyra

export async function initializeLyraBot() {
  lyraClient = new Lyra({
    provider: optimismInfuraProvider,
    subgraphUri: 'https://api.thegraph.com/subgraphs/name/lyra-finance/mainnet',
    blockSubgraphUri: 'https://api.thegraph.com/subgraphs/name/lyra-finance/optimism-mainnet-blocks',
  })

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

  await RunTradeBot(discordClient, twitterClient, telegramClient, lyraClient, twitterClient2)
  await TrackEvents(discordClient, telegramClient, twitterClient1, lyraClient, twitterClient2)

  PricingJob(discordClient)
  LeaderboardJob(discordClient, twitterClient, telegramClient)
  StatsJob(discordClient, twitterClient, telegramClient, lyraClient)
  CoinGeckoJob(discordClient, twitterClient1, telegramClient, lyraClient)
}

export async function SetUpDiscord() {
  if (DISCORD_ENABLED) {
    discordClient = DiscordClient
    discordClient.on('ready', async (client) => {
      console.debug('Discord bot is online!')
    })

    discordClient.on('interactionCreate', async (interaction) => {
      if (!interaction.isCommand()) return

      const tradeChannel = interaction?.guild?.channels.cache.find((channel) => channel.name === TRADE_CHANNEL)
      const statsChannel = interaction?.guild?.channels.cache.find((channel) => channel.name === STATS_CHANNEL)
      const tokenChannel = interaction?.guild?.channels.cache.find((channel) => channel.name === TOKEN_CHANNEL)
      const depositsChannel = interaction?.guild?.channels.cache.find((channel) => channel.name === DEPOSITS_CHANNEL)
      const traderChannel = interaction?.guild?.channels.cache.find((channel) => channel.name === TRADER_CHANNEL)

      const channelName = (interaction?.channel as TextChannel).name
      const { commandName } = interaction

      if (commandName === 'leaderboard') {
        if (channelName === TRADE_CHANNEL) {
          if (interaction) global.LYRA_LEADERBOARD = await GetLeaderBoard(30)
          const post = LeaderboardDiscord(global.LYRA_LEADERBOARD.slice(0, 10))
          await interaction.reply({ embeds: post })
        } else {
          await interaction.reply(`Command 'leaderboard' only available in <#${tradeChannel?.id}>`)
        }
      }
      if (commandName === 'top30') {
        if (channelName === TRADE_CHANNEL) {
          global.LYRA_LEADERBOARD = await GetLeaderBoard(30)
          const post = LeaderboardDiscord(global.LYRA_LEADERBOARD)
          await interaction.reply({ embeds: post })
        } else {
          await interaction.reply(`Command 'top30' only available in <#${tradeChannel?.id}>`)
        }
      }
      if (commandName === 'stats') {
        if (channelName === STATS_CHANNEL) {
          const statsDto = await GetStats(interaction.options.getString('market') as string, lyraClient)
          const stats = StatDiscord(statsDto)
          await interaction.reply({ embeds: stats })
        } else {
          await interaction.reply(`Command 'stats' only available in <#${statsChannel?.id}>`)
        }
      }
      if (commandName === 'help') {
        if (channelName === STATS_CHANNEL || channelName === TRADE_CHANNEL) {
          const help = HelpDiscord()
          await interaction.reply(help)
        } else {
          await interaction.reply(`Command 'help' only available in <#${statsChannel?.id}> or <#${tradeChannel?.id}> `)
        }
      }
      if (commandName === 'lyra') {
        if (channelName === TOKEN_CHANNEL) {
          const lyraDto = await GetCoinGecko()
          const embed = CoinGeckoDiscord(lyraDto)
          await interaction.reply({ embeds: embed })
        } else {
          await interaction.reply(`Command 'lyra' only available in <#${tokenChannel?.id}>`)
        }
      }
      if (commandName === 'quant') {
        //if (channelName === STATS_CHANNEL || channelName === TRADE_CHANNEL) {
        const embed = QuantDiscord()
        await interaction.reply({ embeds: embed })
        // } else {
        //  await interaction.reply(`Command 'quant' only available in <#${statsChannel?.id}> or <#${tradeChannel?.id}> `)
        //}
      }
    })

    await discordClient.login(DISCORD_ACCESS_TOKEN)

    defaultActivity(discordClient)
    await defaultName(discordClient)
  }
}

export async function SetUpTwitter() {
  if (TWITTER_ENABLED) {
    twitterClient = TwitterClient
    twitterClient.readWrite
    twitterClient1 = TwitterClient1
    twitterClient1.readWrite
    twitterClient2 = TwitterClient2
    twitterClient2.readWrite
  }
}

export async function SetUpTelegram() {
  if (TELEGRAM_ENABLED) {
    telegramClient = TelegramClient
  }
}
