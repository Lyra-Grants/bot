import { MessageEmbed } from 'discord.js'
import { TransferDto } from '../types/transferDto'
import { FN, FormattedDateTime } from './common'

// TWITTER
export function TransferTwitter(transfer: TransferDto) {
  const post: string[] = []
  post.push(
    `${transfer.amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} $LYRA ($${transfer.value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}) transfer \n`,
  )
  post.push(
    `from ${
      transfer.fromEns ? transfer.fromEns : transfer.notableFrom ? transfer.from : '🧑 ' + transfer.fromAddress
    }\n`,
  )
  post.push(`to ${transfer.toEns ? transfer.toEns : transfer.notableTo ? transfer.to : '🧑 ' + transfer.toAddress}\n`)
  post.push(`https://optimistic.etherscan.io/tx/${transfer.transactionHash}`)
  return post.join('')
}

// TELEGRAM
// todo

// DISCORD
export function TransferDiscord(transfer: TransferDto): MessageEmbed[] {
  const messageEmbeds: MessageEmbed[] = []
  const tradeEmbed = new MessageEmbed()
    .setColor('#00ff7f')
    .setURL(`${`https://optimistic.etherscan.io/tx/${transfer.transactionHash}`}`)
    .setTitle(`✅ Transfer: ${FN(transfer.amount, 2)} LYRA ($${FN(transfer.value, 2)})`)
    .addFields(
      {
        name: `From:`,
        value: `> ${transfer.fromEns ? transfer.fromEns : transfer.from}`,
        inline: false,
      },
      {
        name: `To:`,
        value: `> ${transfer.toEns ? transfer.toEns : transfer.to}`,
        inline: false,
      },
    )
  tradeEmbed
    .setFooter({
      iconURL: 'https://raw.githubusercontent.com/ethboi/assets/main/optimism.png',
      text: `Optimism`,
    })
    .setTimestamp()
  messageEmbeds.push(tradeEmbed)
  return messageEmbeds
}
