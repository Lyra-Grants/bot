import { MessageEmbed } from 'discord.js'
import { StatDto } from '../types/statDto'

import { FN, FNS, FormattedDateTime, VaultLink } from './common'

export function StatDiscord(stat: StatDto): MessageEmbed[] {
  const messageEmbeds: MessageEmbed[] = []
  const tradeEmbed = new MessageEmbed()
    .setColor('#627EEA')
    .setURL(`${VaultLink(stat.asset)}`)
    .setTitle(`${stat.asset} Market Vault`)
    .addField('TVL', `$${FN(stat.tvl, 0)}`, true)
    .addField('Change (30d)', `${FNS(stat.tvlChange, 4)}%`, true)
    .addField('Token Value', `$${FN(stat.tokenPrice, 4)}`, true)
    .addField('P&L (30d)', `${FNS(stat.pnlChange, 4)}%`, true)
    .addField(`Volume (30d)`, `$${FN(stat.tradingVolume, 2)}`, true)
    .addField(`Fees (30d)`, `$${FN(stat.tradingFees, 2)}`, true)
    .addField('Open Interest', `$${FN(stat.openInterestUsd, 2)}`, true)
    .addField('Net Delta', `${FNS(stat.netDelta, 3)}`, true)
    .addField('Net Std. Vega', `${FNS(stat.netStdVega, 3)}`, true)
    .setFooter({
      iconURL:
        'https://github.com/Lyra-Grants/lyra-avalon-bot/blob/c05bc1e3595ae80d74a37f13da7ce78b219a0b06/src/img/lyra.png?raw=true',
      text: `Source: Lyra.js`,
    })
    .setTimestamp()
  messageEmbeds.push(tradeEmbed)
  return messageEmbeds
}

export function StatTwitter(stat: StatDto) {
  const post: string[] = []
  post.push(`${stat.asset} Market Vault\n`)
  post.push(`💵 P&L (30d) ${FNS(stat.pnlChange, 4)}%\n`)
  post.push(`🏦 TVL $${FN(stat.tvl, 0)}\n`)
  post.push(`📊 Volume (30d) $${FN(stat.tradingVolume, 2)}\n`)
  post.push(`🪙 Token Value $${FN(stat.tokenPrice, 4)}\n`)
  post.push(`💰 Fees (30d) $${FN(stat.tradingFees, 2)}\n`)
  post.push(`📈 Open Interest $${FN(stat.openInterestUsd, 2)}\n`)
  post.push(`\nOptions for everyone, start trading 👇\n`)
  post.push(`${VaultLink(stat.asset)}\n`)
  return post.join('')
}

export function StatTelegram(stat: StatDto) {
  const post: string[] = []
  post.push(`<a href="${VaultLink(stat.asset)}">${stat.asset} Market Vault</a>\n`)
  post.push(`💵 P&L (30d) ${FNS(stat.pnlChange, 4)}%\n`)
  post.push(`🏦 TVL $${FN(stat.tvl, 0)}\n`)
  post.push(`📊 Volume (30d) $${FN(stat.tradingVolume, 2)}\n`)
  post.push(`🪙 Token Value $${FN(stat.tokenPrice, 4)}\n`)
  post.push(`💰 Fees (30d) $${FN(stat.tradingFees, 2)}\n`)
  post.push(`📈 Open Interest $${FN(stat.openInterestUsd, 2)}\n`)
  post.push(`🧮 Net Delta ${FNS(stat.netDelta, 3)}\n`)
  post.push(`〽️ Net Std. Vega ${FNS(stat.netStdVega, 3)}\n`)
  return post.join('')
}
