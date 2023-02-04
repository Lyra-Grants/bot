import Lyra from '@lyrafinance/lyra-js'
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
  lyraClient: Lyra,
): void {
  console.log('Mon Wed Fri Stats job')
  scheduleJob('0 1 * * 1,3,5', async () => {
    const statsDto = await GetStats('eth', lyraClient)
    await BroadCastStats(statsDto, twitterClient, telegramClient, discordClient)

    const statsDtoBtc = await GetStats('btc', lyraClient)
    await BroadCastStats(statsDtoBtc, twitterClient, telegramClient, discordClientBtc)
  })
}

export function CoinGeckoJob(
  discordClient: Client<boolean>,
  twitterClient: TwitterApi,
  telegramClient: Telegraf,
  lyraClient: Lyra,
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
  lyraClient: Lyra,
): void {
  scheduleJob('0 4 * * 1,3,5', async () => {
    const arbDto = await GetArbitrageDeals(lyraClient, 'eth')
    await BroadCast(arbDto, twitterClient, telegramClient, discordClient)

    const arbDtoBtc = await GetArbitrageDeals(lyraClient, 'btc')
    await BroadCast(arbDtoBtc, twitterClient, telegramClient, discordClientBtc)
  })
}