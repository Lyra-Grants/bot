import { TradeDto } from '../types/lyra'
import { EmbedBuilder } from 'discord.js'
import { dollar } from '../utils/utils'
import {
  AmountWording,
  DisplayTrader,
  DisplayTraderNoEmoji,
  EtherScanTransactionLink,
  FN,
  FormattedDate,
  Medal,
  PortfolioLink,
  PositionLink,
  ShowProfitAndLoss,
  TradeHistoryLink,
  TradeShareImage,
  TwitterLink,
} from './common'

export function TradeTwitter(trade: TradeDto) {
  const post: string[] = []

  if (!trade.isLiquidation) {
    post.push(
      `📈 ${trade.isLong ? 'Long' : 'Short'} ${trade.size} $${trade.asset} $${FN(trade.strike, 0)} ${
        trade.isCall ? 'Call' : 'Put'
      }\n`,
    )
    post.push(`${trade.isOpen ? '✅ Opened' : '🚫 Closed'}\n`)
    post.push(`💵 ${AmountWording(trade.isLong, trade.isOpen, trade.isLiquidation)} ${trade.premiumFormatted}\n`)
    if (trade.setCollateralTo != undefined) {
      post.push(`💰 Collateral ${trade.baseCollateralFormatted}\n`)
    }
  } else {
    post.push(`🔥 Liquidation ${trade.size} $${trade.asset} $${FN(trade.strike, 0)} ${trade.isCall ? 'Call' : 'Put'}\n`)
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
  if (trade.leaderBoard.account !== '') {
    post.push(
      `${Medal(trade.leaderBoard.position)} ${trade.leaderBoard.position}. Trader ${dollar(
        trade.leaderBoard.realizedPnl,
      )}\n`,
    )
  }
  post.push(`${DisplayTrader(trade)}\n`)
  post.push(`${PositionLink(trade)}\n`)
  if (trade.url) {
    post.push(`${trade.url}\n`)
  }
  return post.join('')
}

export function TradeTelegram(trade: TradeDto) {
  const img = TradeShareImage(trade)
  const post: string[] = []
  if (!trade.isLiquidation) {
    post.push(
      `📈 ${trade.isLong ? 'Long' : 'Short'} ${trade.size} $${trade.asset} $${FN(trade.strike, 0)} ${
        trade.isCall ? 'Call' : 'Put'
      }\n`,
    )
    post.push(`${trade.isOpen ? '✅ Opened' : '🚫 Closed'}\n`)
    post.push(`💵 ${AmountWording(trade.isLong, trade.isOpen, trade.isLiquidation)} ${trade.premiumFormatted}\n`)
    if (trade.setCollateralTo != undefined) {
      post.push(`💰 Collateral ${trade.baseCollateralFormatted}\n`)
    }
  } else {
    post.push(`🔥 Liquidation ${trade.size} $${trade.asset} $${FN(trade.strike, 0)} ${trade.isCall ? 'Call' : 'Put'}\n`)
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
  if (trade.leaderBoard.account !== '') {
    post.push(
      `${Medal(trade.leaderBoard.position)} #${trade.leaderBoard.position} Trader ${dollar(
        trade.leaderBoard.realizedPnl,
      )}\n`,
    )
  }
  if (trade.fren && trade.fren.name) {
    post.push(`🐦 <a href='${TwitterLink(trade.fren.handle)}'>${trade.fren.name}</a>\n`)
  }
  if (trade.url) {
    post.push(`<a href="${trade.url}">Go to Vault</a>\n`)
  }
  post.push(`<a href='${PositionLink(trade)}'>${DisplayTrader(trade, true)}</a>\n`)
  post.push(`============================\n`)
  post.push(
    `<a href='${EtherScanTransactionLink(trade.transactionHash)}'>Trxn</a> | <a href='${TradeHistoryLink(
      trade,
    )}'>History</a> | <a href='${PortfolioLink(trade.account)}'>Portfolio</a> | <a href='${PositionLink(
      trade,
    )}'>Position</a>\n`,
  )
  post.push(`============================\n`)
  // post.push(`<img src='${img}' />`)
  return post.join('')
}

export function TradeDiscord(trade: TradeDto): EmbedBuilder {
  const url = PositionLink(trade)
  const img = TradeShareImage(trade)
  const tradeEmbed = new EmbedBuilder().setURL(`${url}`)
  if (trade.isLiquidation) {
    tradeEmbed.setImage(
      'https://github.com/Lyra-Grants/lyra-avalon-bot/blob/59b047e6ba0fef174b8380fd26a375d4690c4908/src/img/liquidation.jpg?raw=true',
    )
  }
  if (!trade.isLiquidation) {
    tradeEmbed
      .setTitle(
        `${trade.isOpen ? '✅ Opened:' : '🚫 Closed:'} ${trade.isLong ? 'Long' : 'Short'} ${trade.size} ${
          trade.asset
        } $${FN(trade.strike, 0)} ${trade.isCall ? 'Call' : 'Put'}`,
      )
      .setColor('#60DDBF')
  } else {
    tradeEmbed
      .setTitle(`🔥 Liquidation ${trade.size} $${trade.asset} $${FN(trade.strike, 0)} ${trade.isCall ? 'Call' : 'Put'}`)
      .setColor('#ffa500')
  }

  tradeEmbed.addFields(
    {
      name: `⏰ Expiry`,
      value: `> ${FormattedDate(trade.expiry)}`,
      inline: false,
    },
    {
      name: `💵 ${AmountWording(trade.isLong, trade.isOpen, trade.isLiquidation)}`,
      value: `> ${trade.premiumFormatted}`,
      inline: false,
    },
  )

  if (trade.setCollateralTo != undefined && trade.setCollateralTo > 0) {
    tradeEmbed.addFields({
      name: `💰 Collateral`,
      value: `> ${trade.baseCollateralFormatted}`,
      inline: false,
    })
  }

  tradeEmbed.addFields(
    {
      name: `🏷️ Prices`,
      value: `> Option: $${FN(trade.optionPrice, 2)}\n > Spot: $${FN(trade.spot, 2)}`,
      inline: false,
    },
    {
      name: `⚡ IV`,
      value: `> ${FN(trade.iv, 2)}%`,
      inline: false,
    },
    {
      name: `💸 Fees`,
      value: `> $${FN(trade.fee, 2)}`,
      inline: false,
    },
    {
      name: '👨 Trader',
      value: `> ${DisplayTraderNoEmoji(trade)}`,
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
  if (trade.leaderBoard.account !== '') {
    tradeEmbed.addFields({
      name: `${Medal(trade.leaderBoard.position)} Leaderboard`,
      value: `> #${trade.leaderBoard.position} ${dollar(trade.leaderBoard.realizedPnl)}`,
      inline: false,
    })
  }

  if (trade.fren && trade.fren.name) {
    tradeEmbed.addFields({
      name: `🐦 ${trade.fren.name}`,
      value: `> [view twitter profile](${TwitterLink(trade.fren.handle)})`,
      inline: false,
    })
    if (trade.fren.pfp) {
      tradeEmbed.setThumbnail(`${trade.fren.pfp}`)
    }
  }

  if (trade.url) {
    tradeEmbed.addFields({ name: '👉 Go to Vault', value: `>[deposit into vault] (${trade.url})`, inline: false })
  }

  tradeEmbed.addFields({
    name: `-----`,
    value: `> ${trade.degenMessage}`,
    inline: false,
  })

  tradeEmbed
    .setFooter({
      iconURL:
        'https://github.com/Lyra-Grants/lyra-avalon-bot/blob/c05bc1e3595ae80d74a37f13da7ce78b219a0b06/src/img/lyra.png?raw=true',
      text: `Lyra.js`,
    })
    .setTimestamp()

  return tradeEmbed
}
