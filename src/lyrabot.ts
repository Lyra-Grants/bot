import { RunTradeBot } from './lyra/trades'
import { BroadcastLeaderBoard, GetLeaderBoard, ParsePositionLeaderboard } from './lyra/leaderboard'
import {
  DISCORD_ACCESS_TOKEN,
  DISCORD_ACCESS_TOKEN_BTC,
  DISCORD_ACCESS_TOKEN_SOL,
  DISCORD_ENABLED,
  TELEGRAM_ENABLED,
  TESTNET,
  TWITTER_ENABLED,
} from './secrets'
import { DiscordClient, DiscordClientBtc, DiscordClientSol } from './clients/discordClient'
import { ChatInputCommandInteraction, Client, EmbedBuilder, GuildBasedChannel, TextChannel } from 'discord.js'
import { TwitterApi } from 'twitter-api-v2'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { defaultActivity, defaultName } from './integrations/discord'
import { TwitterClient, TwitterClient1 } from './clients/twitterClient'
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
  ARBS_CHANNEL,
  DEPOSITS_CHANNEL,
  STATS_CHANNEL,
  TOKEN_CHANNEL,
  TRADER_CHANNEL,
  TRADE_CHANNEL,
} from './constants/discordChannels'
import { HelpDiscord, QuantDiscord } from './templates/help'
import { optimismInfuraProvider } from './clients/ethersClient'
import { TrackEvents } from './event/blockEvent'
import { CoinGeckoDiscord } from './templates/coingecko'
import { GetCoinGecko } from './lyra/coingecko'
import { ArbitrageJob, CoinGeckoJob, LeaderBoardFillJob, LeaderboardSendJob, PricingJob, StatsJob } from './schedule'
import printObject from './utils/printObject'
import { GetArbitrageDeals } from './lyra/arbitrage'
import { ArbDiscord } from './templates/arb'
import { GetTrader } from './lyra/trader'
import { TraderDiscord } from './templates/trader'

let discordClient: Client<boolean>
let discordClientBtc: Client<boolean>
let discordClientSol: Client<boolean>
let twitterClient: TwitterApi
let twitterClient1: TwitterApi
let telegramClient: Telegraf<Context<Update>>
let lyra: Lyra

export async function initializeLyraBot() {
  lyra = new Lyra({
    provider: optimismInfuraProvider,
    subgraphUri: 'https://api.thegraph.com/subgraphs/name/lyra-finance/mainnet',
  })

  if (TESTNET) {
    //const signer = new ethers.Wallet(TestWallet().privateKey, lyraClient.provider)
    //faucet(lyraClient, signer)
    //maketrade(lyraClient, signer)
  }

  discordClientBtc = DiscordClientBtc
  discordClient = DiscordClient
  discordClientSol = DiscordClientSol

  await GetPrice()
  await SetUpDiscord(discordClient, 'eth', DISCORD_ACCESS_TOKEN)
  await SetUpDiscord(discordClientBtc, 'btc', DISCORD_ACCESS_TOKEN_BTC)
  await SetUpDiscord(discordClientSol, 'sol', DISCORD_ACCESS_TOKEN_SOL)
  await SetUpTwitter()
  await SetUpTelegram()

  global.LYRA_ENS = {}
  global.LYRA_LEADERBOARD = []
  global.FREN = {}

  if (!TESTNET) {
    await GetLeaderBoard(lyra)
  }

  // const traders = await Promise.all(
  //   global.LYRA_LEADERBOARD.slice(0, 10).map(async (x, index) => await ParsePositionLeaderboard(x, index + 1)),
  // )

  // console.log(traders)

  await RunTradeBot(discordClient, discordClientBtc, twitterClient, telegramClient, lyra)
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

async function SetUpDiscord(discordClient: Client<boolean>, market: string, accessToken: string) {
  if (DISCORD_ENABLED) {
    discordClient.on('ready', async (client) => {
      console.debug(`Discord bot ${market}  is online!`)
    })

    discordClient.on('interactionCreate', async (interaction) => {
      if (!interaction.isCommand()) {
        return
      }

      const tradeChannel = interaction?.guild?.channels.cache.find((channel) => channel.name === TRADE_CHANNEL)
      const statsChannel = interaction?.guild?.channels.cache.find((channel) => channel.name === STATS_CHANNEL)
      const tokenChannel = interaction?.guild?.channels.cache.find((channel) => channel.name === TOKEN_CHANNEL)
      const arbChannel = interaction?.guild?.channels?.cache?.find((channel) => channel.name === ARBS_CHANNEL)
      // const depositsChannel = interaction?.guild?.channels.cache.find((channel) => channel.name === DEPOSITS_CHANNEL)
      // const traderChannel = interaction?.guild?.channels.cache.find((channel) => channel.name === TRADER_CHANNEL)
      const channelName = (interaction?.channel as TextChannel).name
      const { commandName } = interaction

      // eth only
      if (market == 'eth') {
        if (commandName === 'leaderboard') {
          if (channelName === TRADE_CHANNEL) {
            const traders = await Promise.all(
              global.LYRA_LEADERBOARD.slice(0, 10).map(
                async (x, index) => await ParsePositionLeaderboard(x, index + 1),
              ),
            )

            const post = LeaderboardDiscord(traders)
            await interaction.reply({ embeds: post })
          } else {
            await interaction.reply(`Command 'leaderboard' only available in <#${tradeChannel?.id}>`)
          }
        }
        if (commandName === 'top30') {
          if (channelName === TRADE_CHANNEL) {
            const traders = await Promise.all(
              global.LYRA_LEADERBOARD.slice(0, 30).map(
                async (x, index) => await ParsePositionLeaderboard(x, index + 1),
              ),
            )
            const post = LeaderboardDiscord(traders)
            await interaction.reply({ embeds: post })
          } else {
            await interaction.reply(`Command 'top30' only available in <#${tradeChannel?.id}>`)
          }
        }
        if (commandName === 'help') {
          if (channelName === STATS_CHANNEL || channelName === TRADE_CHANNEL) {
            const help = HelpDiscord()
            await interaction.reply(help)
          } else {
            await interaction.reply(
              `Command 'help' only available in <#${statsChannel?.id}> or <#${tradeChannel?.id}> `,
            )
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
          const embed = QuantDiscord()
          await interaction.reply({ embeds: embed })
        }
        if (commandName === 'trader') {
          await TraderInteraction(
            channelName,
            interaction as ChatInputCommandInteraction,
            tradeChannel as GuildBasedChannel,
          )
        }
      }

      if (commandName === 'arbs') {
        await ArbInteraction(
          market,
          channelName,
          interaction as ChatInputCommandInteraction,
          arbChannel as GuildBasedChannel,
        )
      }

      if (commandName === 'stats') {
        await StatsInteraction(
          market,
          channelName,
          interaction as ChatInputCommandInteraction,
          statsChannel as GuildBasedChannel,
        )
      }
    })
    await discordClient.login(accessToken)
    if (!TESTNET) {
      defaultActivity(discordClient, market)
      await defaultName(discordClient, market)
    }
  }
}

async function StatsInteraction(
  market: string,
  channelName: string,
  interaction: ChatInputCommandInteraction,
  channel: GuildBasedChannel,
) {
  if (channelName === STATS_CHANNEL) {
    const statsDto = await GetStats(market, lyra)
    const stats = StatDiscord(statsDto)
    await interaction.reply({ embeds: stats })
  } else {
    await interaction.reply(`Command 'stats' only available in <#${channel?.id}>`)
  }
}

async function ArbInteraction(
  market: string,
  channelName: string,
  interaction: ChatInputCommandInteraction,
  channel: GuildBasedChannel,
) {
  if (channelName === ARBS_CHANNEL) {
    await interaction.deferReply()
    const arbs = await GetArbitrageDeals(lyra, market)
    if (arbs.arbs.length > 0) {
      const embed = ArbDiscord(arbs)
      await interaction.editReply({ embeds: embed })
    } else {
      await interaction.editReply(`No ${market} arbs found.`)
    }
  } else {
    await interaction.reply(`Command 'arbs' only available in <#${channel?.id}>`)
  }
}

async function TraderInteraction(
  channelName: string,
  interaction: ChatInputCommandInteraction,
  channel: GuildBasedChannel,
) {
  if (channelName === TRADE_CHANNEL) {
    await interaction.deferReply()
    const account = interaction.options.getString('account') as string

    const trader = await GetTrader(account, lyra)
    if (trader.account != '') {
      const embed = TraderDiscord(trader)
      await interaction.editReply({ embeds: embed })
    } else {
      await interaction.editReply(`No trader '${account}' found.`)
    }
  } else {
    await interaction.reply(`Command 'trader' only available in <#${channel?.id}>`)
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
