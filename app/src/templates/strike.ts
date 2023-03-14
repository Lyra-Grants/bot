import { Network } from '@lyrafinance/lyra-js'
import { EmbedBuilder } from 'discord.js'
import { BoardDto } from '../types/lyra'
import formatUSD from '../utils/formatUSD'
import { titleCaseWord } from '../utils/utils'
import { ExpiryLink, FormattedDate, MarketColor, NetworkFooter, StatSymbol } from './common'

// TWITTER
export function BoardTwitter(dto: BoardDto, network: Network) {
  const post: string[] = []
  post.push(`New strike${dto.strikes.length > 1 ? 's' : ''} listed!\n`)
  post.push(`${dto.market} Market\n`)
  post.push(`${titleCaseWord(network)}\n`)
  post.push(`⏰ Exp ${FormattedDate(dto.expiry)}\n\n`)
  dto.strikes.map((strike) => {
    post.push(`🎯 ${formatUSD(strike.strikePrice)}\n`)
  })
  post.push(`\nOptions for everyone, start trading 👇\n`)
  post.push(`${ExpiryLink(dto.market, network, dto.expiryString)}`)
  return post.join('')
}

// TELEGRAM
export function BoardTelegram(dto: BoardDto, network: Network) {
  const post: string[] = []
  post.push(`New strike${dto.strikes.length > 1 ? 's' : ''} listed!\n`)
  post.push(`${StatSymbol(dto.market)} ${dto.market} Market\n`)
  post.push(`${titleCaseWord(network)}\n`)
  post.push(`⏰ Exp ${FormattedDate(dto.expiry)}\n\n`)
  dto.strikes.map((strike) => {
    post.push(`🎯 ${formatUSD(strike.strikePrice)}\n`)
  })
  post.push(`\nOptions for everyone, start trading 👇\n`)
  post.push(`<a href='${ExpiryLink(dto.market, network, dto.expiryString)}'>Open trade</a>`)
  return post.join('')
}

// DISCORD
export function BoardDiscord(dto: BoardDto, network: Network): EmbedBuilder[] {
  const embeds: EmbedBuilder[] = []
  const embed = new EmbedBuilder()
    .setColor(MarketColor(dto.asset))
    .setURL(`${ExpiryLink(dto.market, network, dto.expiryString)}`)
    .setTitle(
      `Strike${dto.strikes.length > 1 ? 's' : ''}: ${StatSymbol(dto.market)} ${dto.market} Market | ${FormattedDate(
        dto.expiry,
      )}`,
    )

  dto.strikes.map((strike) => {
    embed.addFields({
      name: `🎯 ${formatUSD(strike.strikePrice)}`,
      value: `> ----------`,
      inline: false,
    })
  })

  NetworkFooter(embed, network)
  embeds.push(embed)
  return embeds
}
