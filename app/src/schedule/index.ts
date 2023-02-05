import Lyra, { Chain } from '@lyrafinance/lyra-js'
import { Client } from 'discord.js'
import { scheduleJob } from 'node-schedule'
import { Telegraf } from 'telegraf'
import { TwitterApi } from 'twitter-api-v2'
import { BroadCast } from '../event/broadcast'
import { GetPrice } from '../integrations/coingecko'
import { defaultActivity, defaultName } from '../integrations/discord'
import { GetArbitrageDeals } from '../lyra/arbitrage'
import { GetCoinGecko } from '../lyra/coingecko'
import { BroadcastLeaderBoard, GetLeaderBoard } from '../lyra/leaderboard'
import { GetStats, BroadCastStats } from '../lyra/stats'

const markets = ['eth', 'btc']

export function PricingJob(discordClient: Client<boolean>, discordClientBtc: Client<boolean>): void {
  console.log('30 min pricing job running')
  scheduleJob('*/30 * * * *', async () => {
    await GetPrice()

    defaultActivity(discordClient, 'eth')
    await defaultName(discordClient, 'eth')

    defaultActivity(discordClientBtc, 'btc')
    await defaultName(discordClientBtc, 'btc')
  })
}

export function LeaderBoardFillJob(): void {
  console.log('On the hour job running')
  scheduleJob('* 0 * * *', async () => {
    await GetLeaderBoard()
  })
}

export function LeaderboardSendJob(
  discordClient: Client<boolean>,
  twitterClient: TwitterApi,
  telegramClient: Telegraf,
): void {
  console.log('Mon Wed Fri leaderboard job')
  scheduleJob('0 0 * * 1,3,5', async () => {
    await BroadcastLeaderBoard(discordClient, twitterClient, telegramClient)
  })
}

export function StatsJob(
  discordClient: Client<boolean>,
  discordClientBtc: Client<boolean>,
  twitterClient: TwitterApi,
  telegramClient: Telegraf,
  chains: Chain[],
): void {
  console.log('Mon Wed Fri Stats job')
  scheduleJob('0 1 * * 1,3,5', async () => {
    chains.map(async (chain) => {
      markets.map(async (market) => {
        const statsDto = await GetStats(market, chain)
        const discord = market == 'eth' ? discordClient : discordClientBtc
        await BroadCastStats(statsDto, twitterClient, telegramClient, discord, chain)
      })
    })
  })
}

export function CoinGeckoJob(
  discordClient: Client<boolean>,
  twitterClient: TwitterApi,
  telegramClient: Telegraf,
): void {
  console.log('Mon Wed Fri Stats job')
  scheduleJob('0 2 * * 1,3,5', async () => {
    const lyraDto = await GetCoinGecko()
    await BroadCast(lyraDto, twitterClient, telegramClient, discordClient)
  })
}

export function ArbitrageJob(
  discordClient: Client<boolean>,
  discordClientBtc: Client<boolean>,
  twitterClient: TwitterApi,
  telegramClient: Telegraf,
  chains: Chain[],
): void {
  scheduleJob('0 4 * * 1,3,5', async () => {
    chains.map(async (chain) => {
      markets.map(async (market) => {
        const arbDto = await GetArbitrageDeals(market, chain)
        const discord = market == 'eth' ? discordClient : discordClientBtc
        await BroadCast(arbDto, twitterClient, telegramClient, discord)
      })
    })
  })
}
