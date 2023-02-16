import { Network } from '@lyrafinance/lyra-js'
import { ActionRowBuilder, ButtonBuilder, Client } from 'discord.js'
import { Telegraf } from 'telegraf'
import { TwitterApi } from 'twitter-api-v2'
import { ZERO_BN } from '../constants/bn'
import { STATS_CHANNEL } from '../constants/discordChannels'
import { SECONDS_IN_MONTH, SECONDS_IN_YEAR } from '../constants/timeAgo'
import { PostDiscord } from '../integrations/discord'
import { PostTelegram } from '../integrations/telegram'
import { SendTweet } from '../integrations/twitter'
import { TWITTER_ENABLED, TELEGRAM_ENABLED, DISCORD_ENABLED } from '../secrets'
import { StatDiscord, StatTelegram, StatTwitter } from '../templates/stats'
import { VaultStats } from '../types/lyra'
import fromBigNumber from '../utils/fromBigNumber'
import getLyraSDK from '../utils/getLyraSDK'

export async function GetStats(marketName: string, network: Network): Promise<VaultStats> {
  // get timestamp from month ago
  console.log(`Getting stats for ${marketName} on ${network}`)
  const lyra = getLyraSDK(network)
  const market = await lyra.market(marketName)

  const period = SECONDS_IN_MONTH
  const [tradingVolumeHistory, liquidityHistory, netGreeksHistory] = await Promise.all([
    market.tradingVolumeHistory({ startTimestamp: market.block.timestamp - period }),
    market.liquidityHistory({ startTimestamp: market.block.timestamp - period }),
    market.netGreeksHistory({ startTimestamp: market.block.timestamp - period }),
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
  const tokenPriceChangeAnnualized = tokenPriceChange / (period / SECONDS_IN_YEAR)

  const totalNotionalVolumeNew = fromBigNumber(tradingVolume.totalNotionalVolume)
  const totalNotionalVolumeOld = fromBigNumber(tradingVolumeHistory[0].totalNotionalVolume)
  const totalNotionalVolume = totalNotionalVolumeNew - totalNotionalVolumeOld
  const totalNotionalVolumeChange =
    totalNotionalVolumeOld > 0 ? (totalNotionalVolumeNew - totalNotionalVolumeOld) / totalNotionalVolumeOld : 0

  const totalFees = fromBigNumber(tradingVolumeHistory.reduce((sum, { vaultFees }) => sum.add(vaultFees), ZERO_BN))

  const openInterest = fromBigNumber(market.openInterest) * fromBigNumber(market.spotPrice)
  return {
    market,
    liquidity,
    netGreeks,
    tradingVolume,
    liquidityHistory,
    netGreeksHistory,
    tradingVolumeHistory,
    tvl,
    tvlChange,
    tokenPrice,
    tokenPriceChange,
    tokenPriceChangeAnnualized,
    totalNotionalVolume,
    totalNotionalVolumeChange,
    totalFees,
    openInterest,
  }
}

export async function BroadCastStats(
  dto: VaultStats,
  twitterClient: TwitterApi,
  telegramClient: Telegraf,
  discordClient: Client<boolean>,
  network: Network,
): Promise<void> {
  if (TWITTER_ENABLED) {
    const post = StatTwitter(dto, network)
    await SendTweet(post, twitterClient)
  }

  if (TELEGRAM_ENABLED) {
    const post = StatTelegram(dto, network)
    await PostTelegram(post, telegramClient)
  }

  if (DISCORD_ENABLED) {
    const embeds = StatDiscord(dto, network)
    const rows: ActionRowBuilder<ButtonBuilder>[] = []
    await PostDiscord(embeds, rows, discordClient, STATS_CHANNEL)
  }
}
