import { MessageEmbed } from 'discord.js'
import { DepositDto } from '../types/depositDto'
import { EtherScanTransactionLink, FN, LyraDappUrl } from './common'

// TWITTER
export function DepositTwitter(dto: DepositDto) {
  const post: string[] = []
  post.push(`💵 $${FN(dto.amount, 2)} sUSD deposit (queued)\n`)
  post.push(`by: ${dto.fromEns ? dto.fromEns : dto.notableFrom ? dto.from : '🧑 ' + dto.fromAddress}\n`)
  post.push(`to: Lyra Eth Market Vault\n\n`)
  post.push(`🏦 Total queued: $${FN(dto.totalQueued, 0)}\n`)
  post.push(`🔗 ${EtherScanTransactionLink(dto.transactionHash)}\n`)
  post.push(`\nOptions for everyone, start trading 👇\n`)
  post.push(`${LyraDappUrl()}`)
  return post.join('')
}

// TELEGRAM
// todo

// DISCORD
export function DepositDiscord(dto: DepositDto): MessageEmbed[] {
  const messageEmbeds: MessageEmbed[] = []
  const tradeEmbed = new MessageEmbed()
    .setColor('#00ff7f')
    .setURL(`${`https://optimistic.etherscan.io/tx/${dto.transactionHash}`}`)
    .setTitle(`Deposit: Eth Market Vault (queued)`)
    .addFields(
      {
        name: `💵 Amount:`,
        value: `> $${FN(dto.amount, 2)} sUSD`,
        inline: false,
      },
      {
        name: `By:`,
        value: `> ${dto.fromEns ? dto.fromEns : dto.from}`,
        inline: false,
      },
      {
        name: `🏦 Total Queued:`,
        value: `> $${FN(dto.totalQueued, 0)}`,
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
