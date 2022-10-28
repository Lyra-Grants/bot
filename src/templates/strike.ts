import { EmbedBuilder } from 'discord.js'
import { BoardDto, DepositDto, StrikeDto } from '../types/lyra'
import { EtherScanTransactionLink, ExpiryLink, FN, FormattedDate, LyraDappUrl } from './common'
import { StatSymbol } from './stats'

// TWITTER
export function BoardTwitter(dto: BoardDto) {
  const post: string[] = []
  post.push(`New strike${dto.strikes.length > 1 ? 's' : ''} listed!\n`)
  post.push(`${StatSymbol(dto.market)} ${dto.market} Market\n`)
  post.push(`⏰ Exp ${FormattedDate(dto.expiry)}\n\n`)
  dto.strikes.map((strike) => {
    post.push(`🎯 $${FN(strike.strikePrice, 0)}\n`)
  })
  post.push(`\nOptions for everyone, start trading 👇\n`)
  post.push(`${ExpiryLink(dto.market, dto.expiryString)}`)
  return post.join('')
}

// TELEGRAM
export function BoardTelegram(dto: BoardDto) {
  const post: string[] = []
  post.push(`New strike${dto.strikes.length > 1 ? 's' : ''} listed!\n`)
  post.push(`${StatSymbol(dto.market)} ${dto.market} Market\n`)
  post.push(`⏰ Exp ${FormattedDate(dto.expiry)}\n\n`)
  dto.strikes.map((strike) => {
    post.push(`🎯 $${FN(strike.strikePrice, 0)}\n`)
  })
  post.push(`\nOptions for everyone, start trading 👇\n`)
  post.push(`<a href='${ExpiryLink(dto.market, dto.expiryString)}'>Open trade</a>`)
  return post.join('')
}

// DISCORD
export function BoardDiscord(dto: BoardDto): EmbedBuilder[] {
  const embeds: EmbedBuilder[] = []
  const embed = new EmbedBuilder()
    .setColor('#00ff7f')
    .setURL(`${ExpiryLink(dto.market, dto.expiryString)}`)
    .setTitle(
      `Strike${dto.strikes.length > 1 ? 's' : ''}: ${StatSymbol(dto.market)} ${dto.market} Market | ${FormattedDate(
        dto.expiry,
      )}`,
    )

  dto.strikes.map((strike) => {
    embed.addFields({
      name: `🎯 $${FN(strike.strikePrice, 0)}`,
      value: `> ----------`,
      inline: false,
    })
  })
  embed
    .setFooter({
      iconURL:
        'https://github.com/Lyra-Grants/lyra-avalon-bot/blob/c05bc1e3595ae80d74a37f13da7ce78b219a0b06/src/img/lyra.png?raw=true',
      text: `Lyra.js`,
    })
    .setTimestamp()
  embeds.push(embed)
  return embeds
}
