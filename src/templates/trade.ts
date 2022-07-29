import { TradeDto } from '../types/tradeDto'
import { MessageEmbed } from 'discord.js'
import { shortAddress } from '../utils/utils'
import {
  AmountShortWording,
  AmountWording,
  EtherScanTransactionLink,
  FN,
  FormattedDate,
  FormattedDateTime,
  Medal,
  PortfolioLink,
  PositionLink,
  ShowProfitAndLoss,
  TradeHistoryLink,
  TradeShareImage,
} from './common'
import { positionsQuery } from '../queries'

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
  post.push(`⚡ IV ${FN(trade.iv, 2)}%\n`)
  post.push(`⏰ Exp ${FormattedDate(trade.expiry)}\n`)
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
  post.push(`⚡ IV ${FN(trade.iv, 2)}%\n`)
  post.push(`⏰ Exp ${FormattedDate(trade.expiry)}\n`)
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
    tradeEmbed.setTitle(`${trade.asset} Trade ${trade.isOpen ? 'Opened' : 'Closed'}`).setColor('#60DDBF')
  } else {
    tradeEmbed
      .setTitle(`🔥 Liquidation ${trade.size} $${trade.asset} $${trade.strike} ${trade.isCall ? 'Call' : 'Put'}`)
      .setColor('#ffa500')
  }

  tradeEmbed.addFields(
    {
      name: `📈 ${trade.isLong ? 'Long' : 'Short'} ${trade.size} ${trade.asset} $${trade.strike} ${
        trade.isCall ? 'Call' : 'Put'
      }`,
      value: `> **IV** ${FN(trade.iv, 2)}%\n > **Exp** ${FormattedDate(trade.expiry)} ${
        trade.setCollateralTo != undefined ? '\n > **Collateral** ' + trade.baseCollateralFormatted : ''
      }`,
      inline: false,
    },
    {
      name: `💵 **${AmountShortWording(trade.isLong, trade.isOpen, trade.isLiquidation)}**`,
      value: `> ${trade.premiumFormatted}`,
      inline: false,
    },
    {
      name: '👨 Trader',
      value: `> ${trade.ens ? trade.ens : trade.trader}`,
      inline: false,
    },
  )
  if (ShowProfitAndLoss(trade.positionTradeCount, trade.pnl)) {
    tradeEmbed.addFields({
      name: `${trade.isProfitable ? '🟢' : '🔴'} ${trade.isProfitable ? 'Profit' : 'Loss'}`,
      value: `> ${trade.pnlFormatted} ${trade.pnlPercentFormatted}`,
      inline: false,
    })
  }
  if (trade.leaderBoard.owner !== '') {
    tradeEmbed.addFields({
      name: `${Medal(trade.leaderBoard.position)} Leaderboard`,
      value: `> #${trade.leaderBoard.position} ${trade.leaderBoard.netPremiumsFormatted}`,
      inline: false,
    })
  }

  tradeEmbed
    .setFooter({
      iconURL:
        'https://github.com/Lyra-Grants/lyra-avalon-bot/blob/c05bc1e3595ae80d74a37f13da7ce78b219a0b06/src/img/lyra.png?raw=true',
      text: `Lyra.js`,
    })
    .setTimestamp()

  return tradeEmbed
}
