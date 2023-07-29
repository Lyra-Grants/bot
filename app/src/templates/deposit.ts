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
  Footer,
  PortfolioLink,
  MarketColor,
  getThumb,
} from './common'
import { titleCaseWord } from '../utils/utils'

export function DepositTwitter(dto: DepositDto, network: Network) {
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

export function DepositDiscord(dto: DepositDto, network: Network): EmbedBuilder[] {
  const embeds: EmbedBuilder[] = []
  const embed = new EmbedBuilder()
    .setColor(`${MarketColor(dto.market)}`)
    .setURL(`${BlockExplorerLink(dto.transactionHash, network)}`)
    .setTitle(`Deposit: ${dto.market} Market Vault`)
    .addFields(
      {
        name: `⛓️ Network`,
        value: `> ${titleCaseWord(network)}`,
        inline: false,
      },
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

  const assetThumb = getThumb(dto.asset.toLowerCase())

  if (assetThumb) {
    embed.setThumbnail(assetThumb)
  }
  Footer(embed)
  embeds.push(embed)
  return embeds
}
