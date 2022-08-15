import { MessageEmbed } from 'discord.js'
import { TransferDto } from '../types/transferDto'
import { EtherScanTransactionLink, FN, FormattedDateTime, LyraDappUrl } from './common'

// TWITTER
export function TransferTwitter(dto: TransferDto) {
  const post: string[] = []
  post.push(`${FN(dto.amount, 2)} $LYRA ($${FN(dto.value, 2)}) transfer \n\n`)
  post.push(`from ${dto.fromEns ? dto.fromEns : dto.notableFrom ? dto.from : '🧑 ' + dto.fromAddress}\n`)
  post.push(`to ${dto.toEns ? dto.toEns : dto.notableTo ? dto.to : '🧑 ' + dto.toAddress}\n\n`)
  post.push(`🔗 ${EtherScanTransactionLink(dto.transactionHash)}\n\n`)
  post.push(`\nOptions for everyone, start trading 👇\n`)
  post.push(`${LyraDappUrl()}`)
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
