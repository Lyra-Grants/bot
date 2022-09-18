import Lyra from '@lyrafinance/lyra-js'
import { Client } from 'discord.js'
import { scheduleJob } from 'node-schedule'
import { Telegraf, Context } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TwitterApi } from 'twitter-api-v2'
import { BroadCast } from '../event/broadcast'
import { GetPrice } from '../integrations/coingecko'
import { defaultActivity, defaultName } from '../integrations/discord'
import { GetArbitrageDeals } from '../lyra/arbitrage'
import { BroadcastCoinGecko, GetCoinGecko } from '../lyra/coingecko'
import { GetLeaderBoard, BroadcastLeaderBoard } from '../lyra/leaderboard'
import { GetStats, BroadCastStats } from '../lyra/stats'

export function PricingJob(discordClient: Client<boolean>, discordClientBtc: Client<boolean>): void {
  console.log('30 min pricing job running')
  scheduleJob('*/30 * * * *', async () => {
    await GetPrice()
    // ETH
    defaultActivity(discordClient)
    await defaultName(discordClient)
    // BTC
    defaultActivity(discordClientBtc, true)
    await defaultName(discordClientBtc, true)
  })
}

export function LeaderboardJob(
  discordClient: Client<boolean>,
  twitterClient: TwitterApi,
  telegramClient: Telegraf<Context<Update>>,
): void {
  console.log('Mon Wed Fri leaderboard job')
  scheduleJob('0 0 * * 1,3,5', async () => {
    global.LYRA_LEADERBOARD = await GetLeaderBoard(30)
    await BroadcastLeaderBoard(discordClient, twitterClient, telegramClient)
  })
}

export function StatsJob(
  discordClient: Client<boolean>,
  discordClientBtc: Client<boolean>,
  twitterClient: TwitterApi,
  telegramClient: Telegraf<Context<Update>>,
  lyraClient: Lyra,
): void {
  console.log('Mon Wed Fri Stats job')
  scheduleJob('0 1 * * 1,3,5', async () => {
    //ETH
    const statsDto = await GetStats('eth', lyraClient)
    await BroadCastStats(statsDto, twitterClient, telegramClient, discordClient)
    //BTC
    const statsDtoBtc = await GetStats('btc', lyraClient)
    await BroadCastStats(statsDtoBtc, twitterClient, telegramClient, discordClientBtc)
  })
}

export function CoinGeckoJob(
  discordClient: Client<boolean>,
  twitterClient: TwitterApi,
  telegramClient: Telegraf<Context<Update>>,
  lyraClient: Lyra,
): void {
  console.log('Mon Wed Fri Stats job')
  scheduleJob('0 2 * * 1,3,5', async () => {
    const lyraDto = await GetCoinGecko()
    await BroadcastCoinGecko(discordClient, twitterClient, telegramClient, lyraDto)
  })
}

export function ArbitrageJob(
  discordClient: Client<boolean>,
  twitterClient: TwitterApi,
  telegramClient: Telegraf<Context<Update>>,
  lyraClient: Lyra,
): void {
  scheduleJob('0 4 * * 1,3,5', async () => {
    const arbDto = await GetArbitrageDeals(lyraClient)
    await BroadCast(arbDto, twitterClient, telegramClient, discordClient)
  })
}
