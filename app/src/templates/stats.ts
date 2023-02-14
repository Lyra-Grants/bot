import { Network } from '@lyrafinance/lyra-js'
import { EmbedBuilder } from 'discord.js'
import { VaultStats } from '../types/lyra'
import fromBigNumber from '../utils/fromBigNumber'
import { FN, FNS, NetworkFooter, VaultLink } from './common'

export function StatDiscord(stat: VaultStats, network: Network): EmbedBuilder[] {
  const messageEmbeds: EmbedBuilder[] = []
  const tradeEmbed = new EmbedBuilder()
    .setColor(`${MarketColor(stat.market.name)}`)
    .setURL(`${VaultLink(stat.market.name, network)}`)
    .setTitle(`${stat.market.name} Market Vault`)
    .addFields(
      { name: 'TVL', value: `> $${FN(stat.tvl, 0)}`, inline: true },
      { name: 'TVL Change (30d)', value: `> ${FNS(stat.tvlChange * 100, 2)}%`, inline: true },
      { name: `Volume (30d)`, value: `> $${FN(stat.totalNotionalVolume, 2)}`, inline: true },
      { name: 'Token Value', value: `> $${FN(stat.tokenPrice, 4)}`, inline: true },
      { name: `Fees (30d)`, value: `> $${FN(stat.totalFees, 2)}`, inline: true },
      { name: 'Open Interest', value: `> $${FN(stat.openInterest, 2)}`, inline: true },
      { name: 'Annualized Perf', value: `> ${FNS(stat.tokenPriceChangeAnnualized * 100, 2)}%`, inline: true },
      { name: 'Net Delta', value: `> ${FNS(fromBigNumber(stat.netGreeks.netDelta), 3)}`, inline: true },
      { name: 'Net Vega', value: `> ${FNS(fromBigNumber(stat.netGreeks.netStdVega), 3)}`, inline: true },
      { name: 'Utilization', value: `> ${FN(stat.liquidity.utilization * 100, 2)}%`, inline: true },
      { name: 'Pending Deposits', value: `> $${FN(fromBigNumber(stat.liquidity.pendingDeposits), 2)}`, inline: true },
      {
        name: 'Pending Withdrawals',
        value: `> $${FN(fromBigNumber(stat.liquidity.pendingWithdrawals), 2)}`,
        inline: true,
      },
    )

  NetworkFooter(tradeEmbed, network)
  messageEmbeds.push(tradeEmbed)
  return messageEmbeds
}

export function StatTwitter(stat: VaultStats, network: Network) {
  const post: string[] = []
  post.push(`${StatSymbol(stat.market.name)} ${stat.market.name} Market Vault\n`)
  post.push(`💵 30d Perf (Annualized) ${FNS(stat.tokenPriceChangeAnnualized * 100, 4)}%\n`)
  post.push(`🏦 TVL $${FN(stat.tvl, 0)}\n`)
  post.push(`📊 Volume (30d) $${FN(stat.totalNotionalVolume, 2)}\n`)
  post.push(`🪙 Token Value $${FN(stat.tokenPrice, 4)}\n`)
  post.push(`💰 Fees (30d) $${FN(stat.totalFees, 2)}\n`)
  post.push(`📈 Open Interest $${FN(stat.openInterest, 2)}\n`)
  post.push(`🔒 Utilization  ${FN(stat.liquidity.utilization * 100, 2)}%\n`)
  post.push(`\nOptions for everyone, start trading 👇\n`)
  post.push(`${VaultLink(stat.market.name, network)}\n`)
  return post.join('')
}

export function StatTelegram(stat: VaultStats, network: Network) {
  const post: string[] = []
  post.push(
    `<a href="${VaultLink(stat.market.name, network)}">${StatSymbol(stat.market.name)} ${
      stat.market.name
    } Market Vault</a>\n`,
  )
  post.push(`💵 30d Perf (Annualized) ${FNS(stat.tokenPriceChangeAnnualized, 4)}%\n`)
  post.push(`🏦 TVL $${FN(stat.tvl, 0)}\n`)
  post.push(`📊 Volume (30d) $${FN(stat.totalNotionalVolume, 2)}\n`)
  post.push(`🪙 Token Value $${FN(stat.tokenPrice, 4)}\n`)
  post.push(`💰 Fees (30d) $${FN(stat.totalFees, 2)}\n`)
  post.push(`📈 Open Interest $${FN(stat.openInterest, 2)}\n`)
  post.push(`🧮 Net Delta ${FNS(fromBigNumber(stat.netGreeks.netDelta), 3)}\n`)
  post.push(`〽️ Net Std. Vega ${FNS(fromBigNumber(stat.netGreeks.netStdVega), 3)}\n`)
  post.push(`🔒 Utilization  ${FN(stat.liquidity.utilization * 100, 2)}%\n`)
  return post.join('')
}

export function StatSymbol(marketName: string) {
  if (
    marketName.toLowerCase() == 'eth' ||
    marketName.toLowerCase() == 'seth-susd' ||
    marketName.toLowerCase() == 'eth-usdc'
  ) {
    return '🔷'
  }
  if (
    marketName.toLowerCase() == 'btc' ||
    marketName.toLowerCase() == 'sbtc-susd' ||
    marketName.toLowerCase() == 'btc-usdc'
  ) {
    return '🔶'
  }
}

export function MarketColor(marketName: string) {
  if (
    marketName.toLowerCase() == 'eth' ||
    marketName.toLowerCase() == 'seth-susd' ||
    marketName.toLowerCase() == 'eth-usdc'
  ) {
    return '#627EEA'
  }
  if (
    marketName.toLowerCase() == 'btc' ||
    marketName.toLowerCase() == 'sbtc-susd' ||
    marketName.toLowerCase() == 'btc-usdc'
  ) {
    return '#F7931A'
  }

  return '#1AF7C0'
}
