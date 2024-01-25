import { TradeDto } from '../types/trade'
import { EmbedBuilder } from 'discord.js'
import { DisplayTrader, TransactionLink, FN, Footer, MarketColor, getThumb, TraderLink } from './common'
import { shortAddress } from '../utils/utils'

export function TradeTwitter(trade: TradeDto) {
  const post: string[] = []
  post.push(`📈 ${trade.isBuy ? 'BUY' : 'SELL'} ${trade.size} ${trade.instrument}\n`)
  post.push(`💵 Premium $${FN(trade.premium, 2)}\n`)
  post.push(`💸 Fees $${FN(trade.fee, 2)}\n`)
  post.push(`${DisplayTrader(trade, true)}\n\n`)
  post.push(`#Options #Trading $BTC $ETH \n\n`)
  post.push(`The storm provides 🌩️⚡\nStart trading now on Lyra V2 👇\n`)
  post.push(`https://v2.lyra.finance`)
  return post.join('')
}

export function TradeTelegram(trade: TradeDto) {
  const post: string[] = []
  post.push(`📈 ${trade.isBuy ? 'BUY' : 'SELL'} ${trade.size} | ${trade.instrument}\n`)
  post.push(`💵 Premium $${FN(trade.premium, 2)}\n`)
  post.push(`💸 Fees $${FN(trade.fee, 2)}\n`)
  post.push(`${DisplayTrader(trade, true)}\n`)
  post.push(`<a href='${TransactionLink(trade.transactionHash)}'>Transaction</a>\n`)
  return post.join('')
}

export function TradeDiscord(trade: TradeDto): EmbedBuilder {
  const tradeEmbed = new EmbedBuilder()
  const assetThumb = getThumb((trade.market as string).toLowerCase())

  if (assetThumb) {
    tradeEmbed.setThumbnail(assetThumb)
  }
  tradeEmbed
    .setTitle(`${trade.isBuy ? 'BUY' : 'SELL'} ${trade.size} | ${trade.instrument}`)
    .setColor(`${MarketColor()}`)
  tradeEmbed.addFields(
    {
      name: `💵 Premium`,
      value: `> $${FN(trade.premium, 2)}`,
      inline: false,
    },
    {
      name: `🏷️ Prices`,
      value: `> Option: $${FN(trade.optionPrice, 2)}\n > Spot: $${FN(trade.spot, 2)}`,
      inline: false,
    },

    {
      name: `💸 Fees`,
      value: `> $${FN(trade.fee, 2)}`,
      inline: false,
    },
    {
      name: '👨 Trader',
      value: `> [${shortAddress(trade.account)}](${TraderLink(trade.account)})`,
      inline: false,
    },
  )

  Footer(tradeEmbed)
  return tradeEmbed
}
