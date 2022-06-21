import { MessageEmbed } from 'discord.js'
import { StatDto } from '../types/statDto'

import { FN, FormattedDateTime } from './common'

export function StatDiscord(stat: StatDto): MessageEmbed[] {
  const messageEmbeds: MessageEmbed[] = []
  const tradeEmbed = new MessageEmbed()
    .setColor('#00ff7f')
    //.setURL('')
    .setTitle(`Current ${stat.asset} Market Pool Value: $${FN(stat.poolValue, 0)}`)
    .addField('Total sUSD (inc. queued)', `${FN(stat.totalsUsd, 0)}`, false)
    .addField('Net Collateral Position', `${FN(stat.netCollateral, 2)}`, false)
    .addField('Net Options Delta', `${FN(stat.netOptionsDelta, 2)}`, false)
    .addField('Net Delta', `${FN(stat.netDelta, 2)}`, false)
    .addField('Net Std. Vega', `${FN(stat.netStdVega, 2)}`, false)
    .addField('Est. Profit / Loss', `${FN(stat.pnl, 2)}%`, false)
    .setFooter({ text: `${FormattedDateTime(stat.timestamp)}` })

  messageEmbeds.push(tradeEmbed)
  return messageEmbeds
}
