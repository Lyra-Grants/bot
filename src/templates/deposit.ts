import { EmbedBuilder } from 'discord.js'
import { DepositDto } from '../types/lyra'
import { DisplayTrader, DisplayTraderNoEmoji, EtherScanTransactionLink, FN, LyraDappUrl } from './common'
import { StatSymbol } from './stats'

// TWITTER
export function DepositTwitter(dto: DepositDto) {
  const post: string[] = []
  post.push(`💵 $${FN(dto.amount, 2)} sUSD Deposit\n\n`)
  post.push(`from ${DisplayTrader(dto)}\n`)
  post.push(`to ${StatSymbol(dto.market)} ${dto.market} Market Vault\n\n`)
  if (dto.totalQueued > 0) {
    post.push(`🏦 Total queued: $${FN(dto.totalQueued, 0)}\n`)
  }
  post.push(`🔗 ${EtherScanTransactionLink(dto.transactionHash)}\n`)
  post.push(`\nOptions for everyone, start trading 👇\n`)
  post.push(`${LyraDappUrl()}`)
  return post.join('')
}

// DISCORD
export function DepositDiscord(dto: DepositDto): EmbedBuilder[] {
  const embeds: EmbedBuilder[] = []
  const embed = new EmbedBuilder()
    .setColor('#00ff7f')
    .setURL(`${`https://optimistic.etherscan.io/tx/${dto.transactionHash}`}`)
    .setTitle(`Deposit: ${StatSymbol(dto.market)} ${dto.market} Market Vault`)
    .addFields(
      {
        name: `💵 Amount:`,
        value: `> $${FN(dto.amount, 2)} sUSD`,
        inline: false,
      },
      {
        name: `from:`,
        value: `> ${DisplayTraderNoEmoji(dto)}`,
        inline: false,
      },
    )

  if (dto.totalQueued > 0) {
    embed.addFields({
      name: `🏦 Total Queued:`,
      value: `> $${FN(dto.totalQueued, 0)}`,
      inline: false,
    })
  }
  embed
    .setFooter({
      iconURL: 'https://raw.githubusercontent.com/ethboi/assets/main/optimism.png',
      text: `Optimism`,
    })
    .setTimestamp()
  embeds.push(embed)
  return embeds
}
