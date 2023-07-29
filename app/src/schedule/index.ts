import { Network } from '@lyrafinance/lyra-js'
import { Client } from 'discord.js'
import { scheduleJob } from 'node-schedule'
import { Telegraf } from 'telegraf'
import { TwitterApi } from 'twitter-api-v2'
import { BroadCast } from '../event/broadcast'
import { GetPrices } from '../integrations/prices'
import { setNameActivityPrice } from '../discord'
import { GetArbitrageDeals } from '../lyra/arbitrage'
import { BroadcastLeaderBoard, FetchLeaderBoard } from '../lyra/leaderboard'
import { GetStats, BroadCastStats } from '../lyra/stats'
import { ETH_OP, BTC_OP, ARB_OP, OP_OP, LYRA_OP } from '../constants/contractAddresses'

const markets = ['eth', 'btc']

export function OneMinuteJob(
  discordClientEth: Client,
  discordClientBtc: Client,
  discordOP: Client,
  discordArb: Client,
  discordLyra: Client,
): void {
  scheduleJob('*/1 * * * *', async () => {
    try {
      console.log(`Getting Prices: ${Date.now()}`)
      const pairs = await GetPrices()
      global.PRICES = pairs
      //ETH
      const ethPair = pairs.find((pair) => pair.baseToken.address.toLowerCase() == ETH_OP.toLowerCase())
      if (ethPair) {
        console.log(ethPair.priceUsd)
        await setNameActivityPrice(discordClientEth, ethPair, 'eth')
      }

      //BTC
      const btcPair = pairs.find((pair) => pair.baseToken.address.toLowerCase() == BTC_OP.toLowerCase())
      if (btcPair) {
        console.log(btcPair.priceUsd)
        await setNameActivityPrice(discordClientBtc, btcPair, 'btc')
      }

      //ARB
      const arbPair = pairs.find((pair) => pair.baseToken.address.toLowerCase() == ARB_OP.toLowerCase())
      if (arbPair) {
        console.log(arbPair.priceUsd)
        await setNameActivityPrice(discordArb, arbPair, 'arb')
      }

      //OP
      const opPair = pairs.find((pair) => pair.baseToken.address.toLowerCase() == OP_OP.toLowerCase())
      if (opPair) {
        console.log(opPair.priceUsd)
        await setNameActivityPrice(discordOP, opPair, 'op')
      }

      //LYRA
      const lyraPair = pairs.find((pair) => pair.baseToken.address.toLowerCase() == LYRA_OP.toLowerCase())
      if (lyraPair) {
        console.log(lyraPair.priceUsd)
        await setNameActivityPrice(discordLyra, lyraPair, 'lyra')
      }
    } catch (e) {
      console.log(e)
    }
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
  twitterClient: TwitterApi,
  telegramClient: Telegraf,
  networks: Network[],
): void {
  console.log('Mon Wed Fri Stats job')
  scheduleJob('0 1 * * 1,3,5', async () => {
    networks.map(async (network) => {
      markets.map(async (market) => {
        const statsDto = await GetStats(market, network)
        await BroadCastStats(statsDto, twitterClient, telegramClient, discordClient, network)
      })
    })
  })
}

export function ArbitrageJob(
  discordClient: Client<boolean>,
  twitterClient: TwitterApi,
  telegramClient: Telegraf,
  networks: Network[],
): void {
  scheduleJob('0 4 * * 1,3,5', async () => {
    networks.map(async (network) => {
      markets.map(async (market) => {
        const arbDto = await GetArbitrageDeals(market, network)
        await BroadCast(arbDto, twitterClient, telegramClient, discordClient, network)
      })
    })
  })
}
