import { Network } from '@lyrafinance/lyra-js'
import { EmbedBuilder } from 'discord.js'
import { DepositDto } from '../types/lyra'
import formatUSD from '../utils/formatUSD'
import {
  DisplayTrader,
  DisplayTraderNoEmoji,
  BlockExplorerLink,
  LyraDappUrl,
  StatSymbol,
  NetworkFooter,
  PortfolioLink,
  MarketColor,
} from './common'

export function DepositTwitter(dto: DepositDto, network: Network, mainnet = false) {
  const post: string[] = []
  post.push(`💵 ${formatUSD(dto.amount)} Deposit\n\n`)
  post.push(`from ${DisplayTrader(dto)}\n`)
  post.push(`to ${StatSymbol(dto.market)} ${dto.market} Market Vault\n\n`)
  if (dto.totalQueued > 0) {
    post.push(`🏦 Total queued: ${formatUSD(dto.totalQueued)}\n`)
  }
  post.push(`\nOptions for everyone, start trading 👇\n`)
  post.push(`${LyraDappUrl()}`)
  return post.join('')
}

export function DepositDiscord(dto: DepositDto, network: Network, mainnet = false): EmbedBuilder[] {
  const embeds: EmbedBuilder[] = []
  const embed = new EmbedBuilder()
    .setColor(`${MarketColor(dto.market)}`)
    .setURL(`${BlockExplorerLink(dto.transactionHash, network)}`)
    .setTitle(`Deposit: ${StatSymbol(dto.market)} ${dto.market} Market Vault`)
    .addFields(
      {
        name: `💵 Amount:`,
        value: `> ${formatUSD(dto.value)}`,
        inline: false,
      },
      {
        name: `From:`,
        value: `> [${DisplayTraderNoEmoji(dto)}](${PortfolioLink(dto.account)})`,
        inline: false,
      },
    )

  if (dto.totalQueued > 0) {
    embed.addFields({
      name: `🏦 Total Queued:`,
      value: `> ${formatUSD(dto.value)}`,
      inline: false,
    })
  }
  NetworkFooter(embed, network)
  embeds.push(embed)
  return embeds
}
