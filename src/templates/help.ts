import { MessageEmbed } from 'discord.js'
import { LyraDto } from '../types/lyraDto'
import { FN, FNS } from './common'

export function HelpDiscord(): string {
  const post: string[] = []
  post.push('```\n')
  post.push('============================================\n')
  post.push('COMMAND          | DESCRIPTION\n')
  post.push('============================================\n')
  post.push('/top30           | Top 30 traders\n')
  post.push('/leaderboard     | Top 10 traders\n')
  post.push('/stats <vault>   | Vault stats\n')
  post.push('/lyra            | LYRA info\n')
  post.push('```\n')
  return post.join('')
}

export function QuantDiscord(): MessageEmbed[] {
  const messageEmbeds: MessageEmbed[] = []
  const embed = new MessageEmbed()
  embed.setImage(
    'https://github.com/Lyra-Grants/lyra-avalon-bot/blob/c05bc1e3595ae80d74a37f13da7ce78b219a0b06/src/img/quant.png?raw=true',
  )
  messageEmbeds.push(embed)
  return messageEmbeds
}

export function LyraDiscord(dto: LyraDto): MessageEmbed[] {
  const messageEmbeds: MessageEmbed[] = []
  const tradeEmbed = new MessageEmbed()
    .setColor('#60DDBF')
    .setTitle(`LYRA Stats`)
    .addField('💵 Price', `> $${FN(dto.price, 4)} \n > **24h:** ${FNS(dto.price_24h, 2)}%`, false)
    .addField('📈 Marketcap', `> $${FN(dto.marketCap, 0)}\n > **CG Rank:** ${FN(dto.marketCapRank, 0)} \n`, false)
    .addField('📊 Fully Diluted Valuation', `> $${FN(dto.fdv, 0)}\n`, false)
    .addField('🏦 Total Value Locked', `> $${FN(dto.tvl, 0)}\n`, false)
    .addField(
      '🪙 Supply',
      `> **Total:** ${FN(dto.totalSupply, 0)}\n > **Circulating:** ${FN(dto.circSupply, 0)}\n`,
      false,
    )
    .setFooter({
      iconURL: 'https://raw.githubusercontent.com/Lyra-Grants/lyra-avalon-bot/main/src/img/coingecko.png',
      text: `Source: CoinGecko`,
    })
    .setTimestamp()

  messageEmbeds.push(tradeEmbed)
  return messageEmbeds
}
