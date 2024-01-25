import { EmbedBuilder } from 'discord.js'
import { TransferDto } from '../types/trade'
import formatUSD from '../utils/formatUSD'
import { BlockExplorerLink, FN, LyraDappUrl, Footer } from './common'
import { titleCaseWord } from '../utils/utils'

// TWITTER
// export function TransferTwitter(dto: TransferDto, network: string) {
//   const post: string[] = []
//   post.push(`${FN(dto.amount, 2)} $${dto.token} (${formatUSD(dto.value)}) transfer \n\n`)
//   post.push(`from ${dto.fromEns ? dto.fromEns : dto.notableFrom ? dto.from : '🧑 ' + dto.fromAddress}\n`)
//   post.push(`to ${dto.toEns ? dto.toEns : dto.notableTo ? dto.to : '🧑 ' + dto.toAddress}\n\n`)
//   post.push(`🔗 ${BlockExplorerLink(dto.transactionHash, network)}\n\n`)
//   post.push(`\nOptions for everyone, start trading 👇\n`)
//   post.push(`${LyraDappUrl()}`)
//   return post.join('')
// }

// // DISCORD
// export function TransferDiscord(dto: TransferDto, network: Network): EmbedBuilder[] {
//   const messageEmbeds: EmbedBuilder[] = []
//   const tradeEmbed = new EmbedBuilder()
//     .setColor('#00ff7f')
//     .setURL(`${BlockExplorerLink(dto.transactionHash)}`)
//     .setTitle(`✅ Transfer: ${FN(dto.amount, 2)} $${dto.token} (${formatUSD(dto.value)})`)
//     .addFields(
//       {
//         name: `⛓️ Network`,
//         value: `> ${titleCaseWord(network)}`,
//         inline: false,
//       },
//       {
//         name: `📤 From:`,
//         value: `> [${dto.fromEns ? dto.fromEns : dto.from}](${BlockExplorerAddress(dto.fromAddress, network)})`,
//         inline: false,
//       },
//       {
//         name: `📥 To:`,
//         value: `> [${dto.toEns ? dto.toEns : dto.to}](${BlockExplorerAddress(dto.toAddress, network)})`,
//         inline: false,
//       },
//     )
//   Footer(tradeEmbed)
//   messageEmbeds.push(tradeEmbed)
//   return messageEmbeds
// }
