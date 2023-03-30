import { Network } from '@lyrafinance/lyra-js'
import { Client } from 'discord.js'
import { scheduleJob } from 'node-schedule'
import { Telegraf } from 'telegraf'
import { TwitterApi } from 'twitter-api-v2'
import { BroadCast } from '../event/broadcast'
import { GetPrices } from '../integrations/prices'
import { defaultActivity, defaultName } from '../integrations/discord'
import { GetArbitrageDeals } from '../lyra/arbitrage'
import { BroadcastLeaderBoard, FetchLeaderBoard } from '../lyra/leaderboard'
import { GetStats, BroadCastStats } from '../lyra/stats'

const markets = ['eth', 'btc']

export function PricingJob(discordClient: Client<boolean>, discordClientBtc: Client<boolean>): void {
  console.log('30 min pricing job running')
  scheduleJob('*/30 * * * *', async () => {
    await GetPrices()

    defaultActivity(discordClient, 'eth')
    await defaultName(discordClient, 'eth')

    defaultActivity(discordClientBtc, 'btc')
    await defaultName(discordClientBtc, 'btc')
  })
}

export function LeaderBoardFillJob(): void {
  console.log('On the hour job running')
  scheduleJob('* 0 * * *', async () => {
    await FetchLeaderBoard()
  })
}

export function LeaderboardSendJob(
  discordClient: Client<boolean>,
  twitterClient: TwitterApi,
  telegramClient: Telegraf,
  networks: Network[],
): void {
  console.log('Mon Wed Fri leaderboard job')
  scheduleJob('0 0 * * 1,3,5', async () => {
    networks.map(async (network) => {
      await BroadcastLeaderBoard(discordClient, twitterClient, telegramClient, network)
    })
  })
}

export function StatsJob(
  discordClient: Client<boolean>,
  discordClientBtc: Client<boolean>,
  twitterClient: TwitterApi,
  telegramClient: Telegraf,
  networks: Network[],
): void {
  console.log('Mon Wed Fri Stats job')
  scheduleJob('0 1 * * 1,3,5', async () => {
    networks.map(async (network) => {
      markets.map(async (market) => {
        const statsDto = await GetStats(market, network)
        const discord = market == 'eth' ? discordClient : discordClientBtc
        await BroadCastStats(statsDto, twitterClient, telegramClient, discord, network)
      })
    })
  })
}

export function ArbitrageJob(
  discordClient: Client<boolean>,
  discordClientBtc: Client<boolean>,
  twitterClient: TwitterApi,
  telegramClient: Telegraf,
  networks: Network[],
): void {
  scheduleJob('0 4 * * 1,3,5', async () => {
    networks.map(async (network) => {
      markets.map(async (market) => {
        const arbDto = await GetArbitrageDeals(market, network)
        const discord = market == 'eth' ? discordClient : discordClientBtc
        await BroadCast(arbDto, twitterClient, telegramClient, discord, network)
      })
    })
  })
}
