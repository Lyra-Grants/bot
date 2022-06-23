import { MessageEmbed } from 'discord.js'
import { StatDto } from '../types/statDto'

import { FN, FNS, FormattedDateTime } from './common'

export function StatDiscord(stat: StatDto): MessageEmbed[] {
  const messageEmbeds: MessageEmbed[] = []
  const tradeEmbed = new MessageEmbed()
    .setColor('#00ff7f')
    //.setURL('')
    .setTitle(`${stat.asset} Market Vault`)
    .addField('TVL', `$${FN(stat.tvl, 0)}`, true)
    .addField('Change (30d)', `${FNS(stat.tvlChange, 4)}%`, true)
    .addField('\u200B', `\u200B`, true)
    .addField('P&L (30d)', `${FNS(stat.pnlChange, 4)}%`, true)
    .addField(`Volume (30d)`, `$${FN(stat.tradingVolume, 2)}`, true)
    .addField(`Fees (30d)`, `$${FN(stat.tradingFees, 2)}`, true)
    .addField('Open Interest', `$${FN(stat.openInterestUsd, 2)}`, true)
    .addField('Net Delta', `${FNS(stat.netDelta, 3)}`, true)
    .addField('Net Std. Vega', `${FNS(stat.netStdVega, 3)}`, true)
    .setFooter({ text: `${FormattedDateTime(stat.timestamp)}` })

  messageEmbeds.push(tradeEmbed)
  return messageEmbeds
}
