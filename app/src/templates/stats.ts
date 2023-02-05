import { Chain } from '@lyrafinance/lyra-js'
import { EmbedBuilder } from 'discord.js'
import { iconUrls } from '../constants/urls'
import { VaultStats } from '../types/lyra'
import fromBigNumber from '../utils/fromBigNumber'
import { FN, FNS, VaultLink } from './common'

export function StatDiscord(stat: VaultStats, chain: Chain): EmbedBuilder[] {
  const messageEmbeds: EmbedBuilder[] = []
  const tradeEmbed = new EmbedBuilder()
    .setColor(chain === Chain.Optimism ? '#ff0420' : '#5865f2')
    .setURL(`${VaultLink(stat.market.name)}`)
    .setTitle(`${StatSymbol(stat.market.name)} ${stat.market.name} Market Vault`)
    .addFields(
      { name: 'TVL', value: `$${FN(stat.tvl, 0)}`, inline: true },
      { name: `Volume (30d)`, value: `$${FN(stat.totalNotionalVolume, 2)}`, inline: true },
      { name: 'Change (30d)', value: `${FNS(stat.tvlChange, 4)}%`, inline: true },
      { name: 'Token Value', value: `$${FN(stat.tokenPrice, 4)}`, inline: true },
      { name: `Fees (30d)`, value: `$${FN(stat.totalFees, 2)}`, inline: true },
      { name: 'Open Interest', value: `$${FN(stat.openInterest, 2)}`, inline: true },
      { name: '30d Perf (Annualized)', value: `${FNS(stat.tokenPriceChangeAnnualized, 4)}%`, inline: true },
      { name: 'Net Delta', value: `${FNS(fromBigNumber(stat.netGreeks.netDelta), 3)}`, inline: true },
      { name: 'Net Std. Vega', value: `${FNS(fromBigNumber(stat.netGreeks.netStdVega), 3)}`, inline: true },
      { name: 'Utilization', value: `${FN(stat.liquidity.utilization, 2)}%`, inline: true },
      { name: 'Pending Deposits', value: `${FN(fromBigNumber(stat.liquidity.pendingDeposits), 2)}`, inline: true },
      {
        name: 'Pending Withdrawals',
        value: `${FN(fromBigNumber(stat.liquidity.pendingWithdrawals), 2)}`,
        inline: true,
      },
    )
    .setFooter({
      iconURL: `${chain === Chain.Optimism ? iconUrls.optimism : iconUrls.arbitrum}`,
      text: `${chain === Chain.Optimism ? 'Optimism' : 'Arbitrum'}`,
    })
    .setTimestamp()
  messageEmbeds.push(tradeEmbed)
  return messageEmbeds
}

export function StatTwitter(stat: VaultStats, chain: Chain) {
  const post: string[] = []
  post.push(`${StatSymbol(stat.market.name)} ${stat.market.name} Market Vault\n`)
  post.push(`💵 30d Perf (Annualized) ${FNS(stat.tokenPriceChangeAnnualized, 4)}%\n`)
  post.push(`🏦 TVL $${FN(stat.tvl, 0)}\n`)
  post.push(`📊 Volume (30d) $${FN(stat.totalNotionalVolume, 2)}\n`)
  post.push(`🪙 Token Value $${FN(stat.tokenPrice, 4)}\n`)
  post.push(`💰 Fees (30d) $${FN(stat.totalFees, 2)}\n`)
  post.push(`📈 Open Interest $${FN(stat.openInterest, 2)}\n`)
  post.push(`🔒 Utilization  ${FN(stat.liquidity.utilization, 2)}%\n`)
  post.push(`\nOptions for everyone, start trading 👇\n`)
  post.push(`${VaultLink(stat.market.name)}\n`)
  return post.join('')
}

export function StatTelegram(stat: VaultStats, chain: Chain) {
  const post: string[] = []
  post.push(
    `<a href="${VaultLink(stat.market.name)}">${StatSymbol(stat.market.name)} ${stat.market.name} Market Vault</a>\n`,
  )
  post.push(`💵 30d Perf (Annualized) ${FNS(stat.tokenPriceChangeAnnualized, 4)}%\n`)
  post.push(`🏦 TVL $${FN(stat.tvl, 0)}\n`)
  post.push(`📊 Volume (30d) $${FN(stat.totalNotionalVolume, 2)}\n`)
  post.push(`🪙 Token Value $${FN(stat.tokenPrice, 4)}\n`)
  post.push(`💰 Fees (30d) $${FN(stat.totalFees, 2)}\n`)
  post.push(`📈 Open Interest $${FN(stat.openInterest, 2)}\n`)
  post.push(`🧮 Net Delta ${FNS(fromBigNumber(stat.netGreeks.netDelta), 3)}\n`)
  post.push(`〽️ Net Std. Vega ${FNS(fromBigNumber(stat.netGreeks.netStdVega), 3)}\n`)
  post.push(`🔒 Utilization  ${FN(stat.liquidity.utilization, 2)}%\n`)
  return post.join('')
}

export function StatSymbol(asset: string) {
  if (asset.toLowerCase() == 'eth') {
    return '🔷'
  }
  if (asset.toLowerCase() == 'btc') {
    return '🔶'
  }
}
