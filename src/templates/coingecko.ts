import { MessageEmbed } from 'discord.js'
import { LyraDto } from '../types/lyraDto'
import { FN, FNS } from './common'

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
      text: `CoinGecko`,
    })
    .setTimestamp()

  messageEmbeds.push(tradeEmbed)
  return messageEmbeds
}
