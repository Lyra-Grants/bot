import Lyra, { Chain, Market } from '@lyrafinance/lyra-js'
import { Client } from 'discord.js'
import { Telegraf } from 'telegraf'
import { TwitterApi } from 'twitter-api-v2'
import { ZERO_BN } from '../constants/bn'
import { STATS_CHANNEL } from '../constants/discordChannels'
import { SECONDS_IN_MONTH } from '../constants/timeAgo'
import { PostDiscord } from '../integrations/discord'
import { PostTelegram } from '../integrations/telegram'
import { SendTweet } from '../integrations/twitter'
import { TWITTER_ENABLED, TELEGRAM_ENABLED, DISCORD_ENABLED, TESTNET } from '../secrets'
import { StatDiscord, StatTelegram, StatTwitter } from '../templates/stats'
import { StatDto } from '../types/lyra'
import fromBigNumber from '../utils/fromBigNumber'
import getLyra from '../utils/getLyra'

export async function GetStats(marketName: string, chain: Chain): Promise<StatDto> {
  // get timestamp from month ago
  const lyra = getLyra(chain)
  const startTimestamp = Math.floor(Date.now() / 1000 - SECONDS_IN_MONTH)
  const market = await Market.get(lyra, marketName)

  const [tradingVolumeHistory, liquidityHistory, netGreeksHistory] = await Promise.all([
    market.tradingVolumeHistory({ startTimestamp }),
    market.liquidityHistory({ startTimestamp }),
    market.netGreeksHistory({ startTimestamp }),
  ])

  const liquidity = liquidityHistory[liquidityHistory.length - 1]
  const netGreeks = netGreeksHistory[netGreeksHistory.length - 1]
  const tradingVolume = tradingVolumeHistory[tradingVolumeHistory.length - 1]

  const tvl = fromBigNumber(liquidity.tvl)
  const tvlOld = fromBigNumber(liquidityHistory[0].tvl)
  const tvlChange = tvlOld > 0 ? (tvl - tvlOld) / tvlOld : 0

  const tokenPrice = fromBigNumber(liquidity.tokenPrice)
  const tokenPriceOld = fromBigNumber(liquidityHistory[0].tokenPrice)
  const tokenPriceChange = tokenPriceOld > 0 ? (tokenPrice - tokenPriceOld) / tokenPriceOld : 0
  const totalNotionalVolumeNew = fromBigNumber(tradingVolume.totalNotionalVolume)
  const totalNotionalVolumeOld = fromBigNumber(tradingVolumeHistory[0].totalNotionalVolume)
  const totalNotionalVolume = totalNotionalVolumeNew - totalNotionalVolumeOld

  const totalFees = fromBigNumber(tradingVolumeHistory.reduce((sum, { vaultFees }) => sum.add(vaultFees), ZERO_BN))
  const openInterest = fromBigNumber(market.openInterest) * fromBigNumber(market.spotPrice)

  const stat: StatDto = {
    asset: market.name,
    tvl: tvl,
    tvlChange: tvlChange,
    tokenPrice: tokenPrice,
    pnlChange: tokenPriceChange,
    openInterestUsd: openInterest,
    openInterestBase: fromBigNumber(market.openInterest),
    netDelta: fromBigNumber(netGreeks.netDelta),
    netStdVega: fromBigNumber(netGreeks.netStdVega),
    timestamp: new Date(),
    tradingFees: totalFees,
    tradingVolume: totalNotionalVolume,
    utilisationRate: liquidity.utilization * 100,
  }
  return stat
}

export async function BroadCastStats(
  dto: StatDto,
  twitterClient: TwitterApi,
  telegramClient: Telegraf,
  discordClient: Client<boolean>,
): Promise<void> {
  if (TWITTER_ENABLED) {
    const post = StatTwitter(dto)
    await SendTweet(post, twitterClient)
  }

  if (TELEGRAM_ENABLED) {
    const post = StatTelegram(dto)
    await PostTelegram(post, telegramClient)
  }

  if (DISCORD_ENABLED) {
    const post = StatDiscord(dto)
    await PostDiscord(post, discordClient, STATS_CHANNEL)
  }
}
