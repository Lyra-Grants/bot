import { AVALON } from '../secrets'
import { TradeDto } from '../types/tradeDto'
import { MessageEmbed } from 'discord.js'
import { shortAddress } from '../utils/utils'
import {
  AmountShortWording,
  AmountWording,
  EtherScanTransactionLink,
  FormattedDate,
  FormattedDateTime,
  Medal,
  PortfolioLink,
  PositionLink,
  ShowProfitAndLoss,
  TradeHistoryLink,
  TradeShareImage,
} from './common'

// TWITTER //
export function TradeTwitter(trade: TradeDto) {
  const post: string[] = []

  if (!trade.isLiquidation) {
    post.push(
      `📈 ${trade.isLong ? 'Long' : 'Short'} ${trade.size} $${trade.asset} $${trade.strike} ${
        trade.isCall ? 'Call' : 'Put'
      }\n`,
    )
    post.push(`${trade.isOpen ? '✅ Opened' : '🚫 Closed'}\n`)
    post.push(`💵 ${AmountWording(trade.isLong, trade.isOpen, trade.isLiquidation)} ${trade.premiumFormatted}\n`)
    if (trade.setCollateralTo != undefined) {
      post.push(`💰 Collateral ${trade.baseCollateralFormatted}\n`)
    }
  } else {
    post.push(`🔥 Liquidation ${trade.size} $${trade.asset} $${trade.strike} ${trade.isCall ? 'Call' : 'Put'}\n`)
    post.push(`💵 Amount ${trade.premiumFormatted}\n`)
    post.push(`🔥 LP Fees $${trade.lpFees?.toFixed(2)}\n`)
  }
  post.push(`⏰Exp ${FormattedDate(trade.expiry)}\n`)
  if (ShowProfitAndLoss(trade.positionTradeCount, trade.pnl)) {
    post.push(
      `${trade.isProfitable ? '🟢' : '🔴'} ${trade.pnlFormatted} ${trade.pnlPercentFormatted} ${
        trade.isProfitable ? 'Profit' : 'Loss'
      }\n`,
    )
  }
  if (trade.leaderBoard.owner !== '') {
    post.push(
      `${Medal(trade.leaderBoard.position)} ${trade.leaderBoard.position}. Trader ${
        trade.leaderBoard.netPremiumsFormatted
      }\n`,
    )
  }
  post.push(`👨‍ ${trade.ens ? trade.ens : trade.trader}\n`)
  post.push(`${PositionLink(trade)}\n`)
  return post.join('')
}

// TELEGRAM //
export function TradeTelegram(trade: TradeDto) {
  const img = TradeShareImage(trade)
  const post: string[] = []
  if (!trade.isLiquidation) {
    post.push(
      `📈 ${trade.isLong ? 'Long' : 'Short'} ${trade.size} $${trade.asset} $${trade.strike} ${
        trade.isCall ? 'Call' : 'Put'
      }\n`,
    )
    post.push(`${trade.isOpen ? '✅ Opened' : '🚫 Closed'}\n`)
    post.push(`💵 ${AmountWording(trade.isLong, trade.isOpen, trade.isLiquidation)} ${trade.premiumFormatted}\n`)
    if (trade.setCollateralTo != undefined) {
      post.push(`💰 Collateral ${trade.baseCollateralFormatted}\n`)
    }
  } else {
    post.push(`🔥 Liquidation ${trade.size} $${trade.asset} $${trade.strike} ${trade.isCall ? 'Call' : 'Put'}\n`)
    post.push(`💵 Amount ${trade.premiumFormatted}\n`)
    post.push(`🔥 LP Fees $${trade.lpFees?.toFixed(2)}\n`)
  }
  post.push(`⏰ ${FormattedDate(trade.expiry)}\n`)
  if (ShowProfitAndLoss(trade.positionTradeCount, trade.pnl)) {
    post.push(
      `${trade.isProfitable ? '🟢' : '🔴'} ${trade.pnlFormatted} ${trade.pnlPercentFormatted} ${
        trade.isProfitable ? 'Profit' : 'Loss'
      }\n`,
    )
  }
  if (trade.leaderBoard.owner !== '') {
    post.push(
      `${Medal(trade.leaderBoard.position)} #${trade.leaderBoard.position} Trader ${
        trade.leaderBoard.netPremiumsFormatted
      }\n`,
    )
  }
  post.push(`👨‍ <a href='${PositionLink(trade)}'>${trade.ens ? trade.ens : shortAddress(trade.trader)}</a>\n`)
  post.push(`============================\n`)
  post.push(
    `<a href='${EtherScanTransactionLink(trade.transactionHash)}'>Trxn</a> | <a href='${TradeHistoryLink(
      trade,
    )}'>History</a> | <a href='${PortfolioLink(trade.trader)}'>Portfolio</a> | <a href='${PositionLink(
      trade,
    )}'>Position</a>\n`,
  )
  post.push(`============================\n`)
  post.push(`⏱️ ${FormattedDateTime(trade.timeStamp)}\n`)
  // post.push(`<img src='${img}' />`)
  return post.join('')
}

// DISCORD //
export function TradeDiscord(trade: TradeDto): MessageEmbed {
  const url = PositionLink(trade)
  const img = TradeShareImage(trade)
  const tradeEmbed = new MessageEmbed().setURL(`${url}`)
  if (trade.isLiquidation) {
    tradeEmbed.setImage(
      'https://github.com/Lyra-Grants/lyra-avalon-bot/blob/59b047e6ba0fef174b8380fd26a375d4690c4908/src/img/liquidation.jpg?raw=true',
    )
  }
  //.setImage(img)

  if (!trade.isLiquidation) {
    tradeEmbed.setTitle(
      `${trade.isOpen ? '✅' : '🚫'} ${trade.isOpen ? 'Open' : 'Close'} ${trade.isLong ? 'Long' : 'Short'} ${
        trade.size
      } $${trade.asset} $${trade.strike} ${trade.isCall ? 'Call' : 'Put'}`,
    )
    if (trade.isOpen) {
      tradeEmbed.setColor('#32cd32')
    } else {
      tradeEmbed.setColor('#ff4500')
    }
  } else {
    tradeEmbed
      .setTitle(`🔥 Liquidation ${trade.size} $${trade.asset} $${trade.strike} ${trade.isCall ? 'Call' : 'Put'}`)
      .setColor('#ffa500')
  }

  tradeEmbed.addFields(
    {
      name: 'Trade Type',
      value: `${trade.isCall ? '📈' : '📉'} ${trade.isLong ? 'LONG' : 'SHORT'} ${trade.isCall ? 'CALL' : 'PUT'}`,
      inline: true,
    },
    {
      name: 'Strike',
      value: `$${trade.strike}`,
      inline: true,
    },
    {
      name: 'Expiry',
      value: `${FormattedDate(trade.expiry)}`,
      inline: true,
    },
    {
      name: `${AmountShortWording(trade.isLong, trade.isOpen, trade.isLiquidation)}`,
      value: `💵 ${trade.premiumFormatted}`,
      inline: true,
    },
    {
      name: 'Size',
      value: `${trade.size}`,
      inline: true,
    },
  )
  tradeEmbed.addField('Collateral', `${trade.setCollateralTo ? '💰 ' + trade.baseCollateralFormatted : '-'}`, true)
  tradeEmbed.addField('Trader', `👨‍ ${trade.ens ? trade.ens : shortAddress(trade.trader)}`, true)

  if (trade.leaderBoard.owner !== '') {
    tradeEmbed.addField(`Leaderboard`, `${Medal(trade.leaderBoard.position)} #${trade.leaderBoard.position}`, true)
    tradeEmbed.addField(`\u200B`, `${trade.leaderBoard.netPremiumsFormatted}`, true)
  }

  if (ShowProfitAndLoss(trade.positionTradeCount, trade.pnl)) {
    tradeEmbed.addField(
      `${trade.isProfitable ? 'Profit' : 'Loss'}`,
      `${trade.isProfitable ? '🟢' : '🔴'} ${trade.pnlFormatted}`,
      true,
    )
    tradeEmbed.addField(`\u200B`, `${trade.pnlPercentFormatted}`, true)
  }
  tradeEmbed
    .setFooter({
      iconURL:
        'https://github.com/Lyra-Grants/lyra-avalon-bot/blob/c05bc1e3595ae80d74a37f13da7ce78b219a0b06/src/img/lyra.png?raw=true',
      text: `Source: Lyra.js`,
    })
    .setTimestamp()

  return tradeEmbed
}
