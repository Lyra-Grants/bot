import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js'
import { ArbDto, Arb } from '../types/lyra'
import { ProviderType } from '../types/arbs'
import { FN, FormattedDate, FormattedDateShort, MarketColor, NetworkFooter, StatSymbol } from './common'
import { Network } from '@lyrafinance/lyra-js'

const deribitUrl = 'https://www.deribit.com/?reg=17349.7477'

export function ArbTelegram(dto: ArbDto, network: Network) {
  const post: string[] = []
  post.push(`${StatSymbol(dto.market)} $${dto.market.toUpperCase()} Arbs Deribit | Lyra\n\n`)
  post.push(`⛓️ Network: ${network}\n`)
  dto.arbs.slice(0, 10).map((arb) => {
    post.push(`✨ $${FN(arb.strike, 0)} ${FormattedDateShort(new Date(arb.expiration))} ${arb.type}\n`)
    post.push(
      `🔹 Buy $${FN(arb.buy.askPrice as number, 2)} ${
        arb.buy.provider === ProviderType.DERIBIT ? 'DB' : `LYRA ${network}`
      }\n`,
    )
    post.push(
      `🔸 Sell $${FN(arb.sell.bidPrice as number, 2)} ${
        arb.sell.provider === ProviderType.DERIBIT ? 'DB' : `LYRA ${network}`
      }\n`,
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
export function ArbTwitter(dto: ArbDto, network: Network) {
  const post: string[] = []
  post.push(`$${dto.market.toUpperCase()} Arbs Deribit | Lyra\n\n`)
  dto.arbs.slice(0, 3).map((arb) => {
    post.push(`$${FN(arb.strike, 0)} ${FormattedDateShort(new Date(arb.expiration))} ${arb.type}\n`)
    post.push(`⛓️ Network: ${network}\n`)
    post.push(
      `🔹 Buy $${FN(arb.buy.askPrice as number, 2)} ${
        arb.buy.provider === ProviderType.DERIBIT ? 'DB' : `LYRA ${network}`
      }\n🔸 Sell $${FN(arb.sell.bidPrice as number, 2)} ${
        arb.sell.provider === ProviderType.DERIBIT ? 'DB' : `LYRA ${network}`
      }\nAPY: ${FN(arb.apy, 2)}%\n\n`,
    )
  })
  post.push(`10% trading discount👇\n`)
  post.push(`${deribitUrl}\n`)
  return post.join('')
}

// 25 fields // 10 embeds
// DISCORD
export function ArbDiscord(dto: ArbDto, network: Network) {
  const embeds: EmbedBuilder[] = []
  const rows: ActionRowBuilder<ButtonBuilder>[] = []
  const embed = new EmbedBuilder()
    .setColor(`${MarketColor(dto.market)}`)
    .setTitle(`$${dto.market.toUpperCase()} Arbitrage: DERIBIT | LYRA`)

  dto.arbs.slice(0, 10).map((arb) => {
    Arb(arb, dto.market, network, embed)
  })

  // const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
  //   new ButtonBuilder().setCustomId('arb-deribit1').setLabel('Arb Deribit 1').setStyle(ButtonStyle.Primary),
  //   new ButtonBuilder().setCustomId('arb-deribit2').setLabel('Arb Deribit 2').setStyle(ButtonStyle.Danger),
  //   new ButtonBuilder().setLabel('Arb Deribit 3').setStyle(ButtonStyle.Link).setURL(deribitUrl),
  //   new ButtonBuilder().setCustomId('arb-deribit4').setLabel('Arb Deribit 4').setStyle(ButtonStyle.Secondary),
  //   new ButtonBuilder().setCustomId('arb-deribit5').setLabel('Arb Deribit 5').setStyle(ButtonStyle.Success),
  // )

  NetworkFooter(embed, network)
  embeds.push(embed)
  //rows.push(buttons)

  return { embeds, rows }
}

function Arb(dto: Arb, market: string, network: Network, embed: EmbedBuilder) {
  embed.addFields({
    name: `✨ $${FN(dto.strike, 0)} ${FormattedDate(new Date(dto.expiration))} ${dto.type}`,
    value: `> 🔹 **Buy** [$${FN(dto.buy.askPrice as number, 2)} ${dto.buy.provider}](${ProviderUrl(
      dto.buy.provider,
      market,
      network,
    )})\n > 🔸 **Sell** [$${FN(dto.sell.bidPrice as number, 2)} ${dto.sell.provider}](${ProviderUrl(
      dto.sell.provider,
      market,
      network,
    )})\n > **Discount** $${FN(dto.amount, 2)} (${FN(dto.discount, 2)}%)\n > **APY** ${FN(dto.apy, 2)}%`,
    inline: false,
  })
}

function ProviderUrl(provider: ProviderType, market: string, network: Network) {
  if (provider === ProviderType.DERIBIT) {
    return deribitUrl //'https://www.deribit.com/options/ETH'
  }

  return `https://app.lyra.finance/#/trade/${network}/${market}`
}
