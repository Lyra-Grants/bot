import { MessageEmbed } from 'discord.js'
import { TransferDto } from '../types/transferDto'
import { FormattedDateTime } from './common'

// TWITTER
// todo

// TELEGRAM
// todo

// DISCORD
export function TransferDiscord(transfer: TransferDto): MessageEmbed[] {
  const messageEmbeds: MessageEmbed[] = []
  const tradeEmbed = new MessageEmbed()
    .setColor('#00ff7f')
    .setURL(`${`https://optimistic.etherscan.io/tx/${transfer.transactionHash}`}`)
    .setTitle(`✅ Transfer: ${transfer.amount.toFixed(2)} $LYRA ($${transfer.value.toFixed(2)})`)
    .addField('From', `${transfer.fromEns ? transfer.fromEns : transfer.from}`, false)
    .addField('To', `${transfer.toEns ? transfer.toEns : transfer.to}`, false)
    .setFooter({ text: `${FormattedDateTime(transfer.timestamp)}` })

  messageEmbeds.push(tradeEmbed)
  return messageEmbeds
}
