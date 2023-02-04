import { EmbedBuilder } from 'discord.js'
import { ArbDto, Arb } from '../types/lyra'
import { ProviderType } from '../types/arbs'
import { FN, FormattedDate, FormattedDateShort } from './common'
import { StatSymbol } from './stats'

const deribitUrl = 'https://www.deribit.com/?reg=17349.7477'

export function ArbTelegram(dto: ArbDto) {
  const post: string[] = []
  post.push(`${StatSymbol(dto.market)} $${dto.market.toUpperCase()} Arbs Deribit | Lyra\n\n`)
  dto.arbs.slice(0, 10).map((arb) => {
    post.push(`✨ $${FN(arb.strike, 0)} ${FormattedDateShort(new Date(arb.expiration))} ${arb.type}\n`)
    post.push(
      `🔹 Buy $${FN(arb.buy.askPrice as number, 2)} ${arb.buy.provider === ProviderType.DERIBIT ? 'DB' : 'LY'}\n`,
    )
    post.push(
      `🔸 Sell $${FN(arb.sell.bidPrice as number, 2)} ${arb.sell.provider === ProviderType.DERIBIT ? 'DB' : 'LY'}\n`,
    )
    post.push(`Discount $${FN(arb.amount, 2)} (${FN(arb.discount, 2)}%)\n`)
    post.push(`APY ${FN(arb.apy, 2)}%\n\n`)
  })
  post.push(`============================\n`)
  post.push(`👉 <a href='${deribitUrl}'>10% Deribit trading discount</a> 👈\n`)
  post.push(`============================\n`)
  return post.join('')
}

// TWITTER
export function ArbTwitter(dto: ArbDto) {
  const post: string[] = []
  post.push(`$${dto.market.toUpperCase()} Arbs Deribit | Lyra\n\n`)

  dto.arbs.slice(0, 3).map((arb) => {
    post.push(`$${FN(arb.strike, 0)} ${FormattedDateShort(new Date(arb.expiration))} ${arb.type}\n`)
    post.push(
      `🔹 Buy $${FN(arb.buy.askPrice as number, 2)} ${
        arb.buy.provider === ProviderType.DERIBIT ? 'DB' : 'LY'
      }\n🔸 Sell $${FN(arb.sell.bidPrice as number, 2)} ${
        arb.sell.provider === ProviderType.DERIBIT ? 'DB' : 'LY'
      }\nAPY: ${FN(arb.apy, 2)}%\n\n`,
    )
  })
  post.push(`10% trading discount👇\n`)
  post.push(`${deribitUrl}\n`)
  return post.join('')
}

// 25 fields // 10 embeds
// DISCORD
export function ArbDiscord(dto: ArbDto): EmbedBuilder[] {
  const messageEmbeds: EmbedBuilder[] = []
  const embed = new EmbedBuilder()
    .setColor('#60DDBF')
    .setTitle(`${StatSymbol(dto.market)} $${dto.market.toUpperCase()} Arbitrage: DERIBIT | LYRA`)

  dto.arbs.slice(0, 10).map((arb) => {
    Arb(arb, dto.market, embed)
  })
  embed
    .setFooter({
      iconURL:
        'https://github.com/Lyra-Grants/lyra-avalon-bot/blob/c05bc1e3595ae80d74a37f13da7ce78b219a0b06/src/img/lyra.png?raw=true',
      text: `Lyra.js`,
    })
    .setTimestamp()
  messageEmbeds.push(embed)
  return messageEmbeds
}

function Arb(dto: Arb, market: string, embed: EmbedBuilder) {
  embed.addFields({
    name: `✨ $${FN(dto.strike, 0)} ${FormattedDate(new Date(dto.expiration))} ${dto.type}`,
    value: `> 🔹 **Buy** [$${FN(dto.buy.askPrice as number, 2)} ${dto.buy.provider}](${ProviderUrl(
      dto.buy.provider,
      market,
    )})\n > 🔸 **Sell** [$${FN(dto.sell.bidPrice as number, 2)} ${dto.sell.provider}](${ProviderUrl(
      dto.sell.provider,
      market,
    )})\n > **Discount** $${FN(dto.amount, 2)} (${FN(dto.discount, 2)}%)\n > **APY** ${FN(dto.apy, 2)}%`,
    inline: false,
  })
}

function ProviderUrl(provider: ProviderType, market: string) {
  if (provider === ProviderType.DERIBIT) {
    return deribitUrl //'https://www.deribit.com/options/ETH'
  }

  return `https://app.lyra.finance/trade/${market}`
}
