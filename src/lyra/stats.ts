import Lyra, { Market } from '@lyrafinance/lyra-js'
import { Client } from 'discord.js'
import { Telegraf, Context } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TwitterApi } from 'twitter-api-v2'
import { ZERO_BN } from '../constants/bn'
import { STATS_CHANNEL } from '../constants/discordChannels'
import { SECONDS_IN_MONTH } from '../constants/timeAgo'
import { PostDiscord } from '../integrations/discord'
import { PostTelegram } from '../integrations/telegram'
import { SendTweet } from '../integrations/twitter'
import { TWITTER_ENABLED, TELEGRAM_ENABLED, DISCORD_ENABLED } from '../secrets'
import { StatDiscord, StatTelegram, StatTwitter } from '../templates/stats'
import { StatDto } from '../types/lyra'
import fromBigNumber from '../utils/fromBigNumber'

export async function GetStats(marketName: string, lyra: Lyra): Promise<StatDto> {
  // get timestamp from month ago
  const startTimestamp = Math.floor(Date.now() / 1000 - SECONDS_IN_MONTH)
  const market = await Market.get(lyra, marketName)

  const [tradingVolumeHistory, liquidityHistory, netGreeks] = await Promise.all([
    market.tradingVolumeHistory({ startTimestamp }),
    market.liquidityHistory({ startTimestamp }),
    market.netGreeks(),
  ])

  const totalNotionalVolume = tradingVolumeHistory[tradingVolumeHistory.length - 1].totalNotionalVolume
  const totalNotionalVolume30DAgo = tradingVolumeHistory[0].totalNotionalVolume
  const tradingVolume30D = fromBigNumber(totalNotionalVolume.sub(totalNotionalVolume30DAgo))
  const fees = tradingVolumeHistory.reduce(
    (sum, tradingVolume) =>
      sum
        .add(tradingVolume.deltaCutoffFees)
        .add(tradingVolume.lpLiquidationFees)
        .add(tradingVolume.optionPriceFees)
        .add(tradingVolume.spotPriceFees)
        .add(tradingVolume.vegaFees)
        .add(tradingVolume.varianceFees),
    ZERO_BN,
  )

  const liquidity = market.liquidity
  const tvl = fromBigNumber(market.tvl)
  const tvl30DAgo = liquidityHistory.length ? fromBigNumber(liquidityHistory[0].nav) : 0
  const tvlChange = tvl30DAgo > 0 ? ((tvl - tvl30DAgo) / tvl30DAgo) * 100 : 1.0
  const tokenPrice = fromBigNumber(liquidity.tokenPrice)
  const tokenPrice30DAgo = liquidityHistory.length ? fromBigNumber(liquidityHistory[0].tokenPrice) : 0
  const tokenPriceChange = tokenPrice30DAgo > 0 ? ((tokenPrice - tokenPrice30DAgo) / tokenPrice30DAgo) * 100 : 1.0
  const openInterestUsd = fromBigNumber(market.openInterest) * fromBigNumber(market.spotPrice)

  const stat: StatDto = {
    asset: market.name,
    tvl: tvl,
    tvlChange: tvlChange,
    tokenPrice: tokenPrice,
    pnlChange: tokenPriceChange,
    openInterestUsd: openInterestUsd,
    openInterestBase: fromBigNumber(market.openInterest),
    netDelta: fromBigNumber(netGreeks.netDelta),
    netStdVega: fromBigNumber(netGreeks.netStdVega),
    timestamp: new Date(),
    tradingFees: fromBigNumber(fees),
    tradingVolume: tradingVolume30D,
    utilisationRate: liquidity.utilization * 100,
  }
  return stat
}

export async function BroadCastStats(
  dto: StatDto,
  twitterClient: TwitterApi,
  telegramClient: Telegraf<Context<Update>>,
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
    console.log(post)
    await PostDiscord(post, discordClient, STATS_CHANNEL)
  }
}
