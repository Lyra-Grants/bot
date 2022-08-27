import { EmbedBuilder } from 'discord.js'
import { LyraDto } from '../types/lyraDto'
import { FN, FNS, LyraDappUrl } from './common'

export function CoinGeckoDiscord(dto: LyraDto): EmbedBuilder[] {
  const messageEmbeds: EmbedBuilder[] = []
  const tradeEmbed = new EmbedBuilder()
    .setColor('#60DDBF')
    .setTitle(`LYRA Stats`)
    .addFields(
      { name: '💵 Price', value: `> $${FN(dto.price, 4)} \n > **24h:** ${FNS(dto.price_24h, 2)}%`, inline: false },
      {
        name: `📈 Marketcap`,
        value: `> $${FN(dto.marketCap, 0)}\n > **CG Rank:** ${FN(dto.marketCapRank, 0)}`,
        inline: false,
      },
      {
        name: `📊 Fully Diluted Valuation`,
        value: `> $${FN(dto.fdv, 0)}`,
        inline: false,
      },
      {
        name: `🏦 Total Value Locked`,
        value: `> $${FN(dto.tvl, 0)}`,
        inline: false,
      },
      {
        name: `🪙 Supply`,
        value: `> **Total:** ${FN(dto.totalSupply, 0)}\n > **Circulating:** ${FN(dto.circSupply, 0)}`,
        inline: false,
      },
    )
    .setFooter({
      iconURL: 'https://raw.githubusercontent.com/Lyra-Grants/lyra-avalon-bot/main/src/img/coingecko.png',
      text: `CoinGecko`,
    })
    .setTimestamp()

  messageEmbeds.push(tradeEmbed)
  return messageEmbeds
}

export function CoinGeckoTwitter(dto: LyraDto): string {
  const post: string[] = []
  post.push(`$LYRA Stats\n`)
  post.push(`💵 Price: $${FN(dto.price, 4)} (24h: ${FNS(dto.price_24h, 2)}%)\n`)
  post.push(`📈 Marketcap: $${FN(dto.marketCap, 0)}\n`)
  post.push(`🦎 CG Rank: ${FN(dto.marketCapRank, 0)}\n`)
  post.push(`📊 FDV: $${FN(dto.fdv, 0)}\n`)
  post.push(`🏦 TVL: $${FN(dto.tvl, 0)}\n`)
  post.push(`🪙 Supply: Total 1B, Circulating: ${FN(dto.circSupply, 0)}\n`)
  post.push(`\nOptions for everyone, start trading 👇\n`)
  post.push(`${LyraDappUrl()}\n`)
  return post.join('')
}
