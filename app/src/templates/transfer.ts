import { Network } from '@lyrafinance/lyra-js'
import { EmbedBuilder } from 'discord.js'
import { TransferDto } from '../types/lyra'
import formatUSD from '../utils/formatUSD'
import { BlockExplorerAddress, BlockExplorerLink, FN, LyraDappUrl, NetworkFooter } from './common'

// TWITTER
export function TransferTwitter(dto: TransferDto, network: Network) {
  const post: string[] = []
  post.push(`${FN(dto.amount, 2)} $${dto.token} (${formatUSD(dto.value)}) transfer \n\n`)
  post.push(`from ${dto.fromEns ? dto.fromEns : dto.notableFrom ? dto.from : '🧑 ' + dto.fromAddress}\n`)
  post.push(`to ${dto.toEns ? dto.toEns : dto.notableTo ? dto.to : '🧑 ' + dto.toAddress}\n\n`)
  post.push(`🔗 ${BlockExplorerLink(dto.transactionHash, network)}\n\n`)
  post.push(`\nOptions for everyone, start trading 👇\n`)
  post.push(`${LyraDappUrl()}`)
  return post.join('')
}

// DISCORD
export function TransferDiscord(dto: TransferDto, network: Network): EmbedBuilder[] {
  const messageEmbeds: EmbedBuilder[] = []
  const tradeEmbed = new EmbedBuilder()
    .setColor('#00ff7f')
    .setURL(`${BlockExplorerLink(dto.transactionHash, network)}`)
    .setTitle(`✅ Transfer: ${FN(dto.amount, 2)} $${dto.token} (${formatUSD(dto.value)})`)
    .addFields(
      {
        name: `From:`,
        value: `> [${dto.fromEns ? dto.fromEns : dto.from}](${BlockExplorerAddress(dto.fromAddress, network)})`,
        inline: false,
      },
      {
        name: `To:`,
        value: `> [${dto.toEns ? dto.toEns : dto.to}](${BlockExplorerAddress(dto.toAddress, network)})`,
        inline: false,
      },
    )
  NetworkFooter(tradeEmbed, network)
  messageEmbeds.push(tradeEmbed)
  return messageEmbeds
}
