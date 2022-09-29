import { EmbedBuilder } from 'discord.js'
import { StatDto } from '../types/lyra'
import { FN, FNS, VaultLink } from './common'

export function StatDiscord(stat: StatDto): EmbedBuilder[] {
  const messageEmbeds: EmbedBuilder[] = []
  const tradeEmbed = new EmbedBuilder()
    .setColor('#627EEA')
    .setURL(`${VaultLink(stat.asset)}`)
    .setTitle(`${StatSymbol(stat.asset)} ${stat.asset} Market Vault`)
    .addFields(
      { name: 'TVL', value: `$${FN(stat.tvl, 0)}`, inline: true },
      { name: 'Change (30d)', value: `${FNS(stat.tvlChange, 4)}%`, inline: true },
      { name: 'Token Value', value: `$${FN(stat.tokenPrice, 4)}`, inline: true },
      { name: 'P&L (30d)', value: `${FNS(stat.pnlChange, 4)}%`, inline: true },
      { name: `Volume (30d)`, value: `$${FN(stat.tradingVolume, 2)}`, inline: true },
      { name: `Fees (30d)`, value: `$${FN(stat.tradingFees, 2)}`, inline: true },
      { name: 'Open Interest', value: `$${FN(stat.openInterestUsd, 2)}`, inline: true },
      { name: 'Net Delta', value: `${FNS(stat.netDelta, 3)}`, inline: true },
      { name: 'Net Std. Vega', value: `${FNS(stat.netStdVega, 3)}`, inline: true },
      { name: 'Utilization', value: `${FN(stat.utilisationRate, 2)}%`, inline: true },
    )
    .setFooter({
      iconURL:
        'https://github.com/Lyra-Grants/lyra-avalon-bot/blob/c05bc1e3595ae80d74a37f13da7ce78b219a0b06/src/img/lyra.png?raw=true',
      text: `Lyra.js`,
    })
    .setTimestamp()
  messageEmbeds.push(tradeEmbed)
  return messageEmbeds
}

export function StatTwitter(stat: StatDto) {
  const post: string[] = []
  post.push(`${StatSymbol(stat.asset)} ${stat.asset} Market Vault\n`)
  post.push(`💵 P&L (30d) ${FNS(stat.pnlChange, 4)}%\n`)
  post.push(`🏦 TVL $${FN(stat.tvl, 0)}\n`)
  post.push(`📊 Volume (30d) $${FN(stat.tradingVolume, 2)}\n`)
  post.push(`🪙 Token Value $${FN(stat.tokenPrice, 4)}\n`)
  post.push(`💰 Fees (30d) $${FN(stat.tradingFees, 2)}\n`)
  post.push(`📈 Open Interest $${FN(stat.openInterestUsd, 2)}\n`)
  post.push(`🔒 Utilization  ${FN(stat.utilisationRate, 2)}%\n`)
  post.push(`\nOptions for everyone, start trading 👇\n`)
  post.push(`${VaultLink(stat.asset)}\n`)
  return post.join('')
}

export function StatTelegram(stat: StatDto) {
  const post: string[] = []
  post.push(`<a href="${VaultLink(stat.asset)}">${StatSymbol(stat.asset)} ${stat.asset} Market Vault</a>\n`)
  post.push(`💵 P&L (30d) ${FNS(stat.pnlChange, 4)}%\n`)
  post.push(`🏦 TVL $${FN(stat.tvl, 0)}\n`)
  post.push(`📊 Volume (30d) $${FN(stat.tradingVolume, 2)}\n`)
  post.push(`🪙 Token Value $${FN(stat.tokenPrice, 4)}\n`)
  post.push(`💰 Fees (30d) $${FN(stat.tradingFees, 2)}\n`)
  post.push(`📈 Open Interest $${FN(stat.openInterestUsd, 2)}\n`)
  post.push(`🧮 Net Delta ${FNS(stat.netDelta, 3)}\n`)
  post.push(`〽️ Net Std. Vega ${FNS(stat.netStdVega, 3)}\n`)
  post.push(`🔒 Utilization  ${FN(stat.utilisationRate, 2)}%\n`)
  return post.join('')
}

export function StatSymbol(asset: string) {
  if (asset.toLowerCase() == 'eth') {
    return '🔷'
  }
  if (asset.toLowerCase() == 'btc') {
    return '🔶'
  }
  if (asset.toLowerCase() == 'sol') {
    return '🟣'
  }
}
