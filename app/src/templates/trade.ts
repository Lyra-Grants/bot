import { TradeDto } from '../types/lyra'
import { EmbedBuilder } from 'discord.js'
import {
  AmountWording,
  DisplayTrader,
  DisplayTraderNoEmoji,
  BlockExplorerLink,
  FN,
  FormattedDate,
  Medal,
  Footer,
  PortfolioLink,
  PositionLink,
  ShowProfitAndLoss,
  TradeHistoryLink,
  TradeShareImage,
  TwitterLink,
  MarketColor,
  BlockExplorerAddress,
  getThumb,
} from './common'
import { Network } from '@lyrafinance/lyra-js'
import formatUSD from '../utils/formatUSD'
import { titleCaseWord } from '../utils/utils'

export function TradeTwitter(trade: TradeDto, network: Network) {
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
  post.push(`⛓️ Network: ${network}\n`)
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
      `${Medal(trade.leaderBoard.position)} ${trade.leaderBoard.position}. Trader ${formatUSD(
        trade.leaderBoard.realizedPnl,
      )}\n`,
    )
  }
  post.push(`${DisplayTrader(trade)}\n`)
  post.push(`${PositionLink(trade, network)}\n`)
  if (trade.url) {
    post.push(`${trade.url}\n`)
  }
  return post.join('')
}

export function TradeTelegram(trade: TradeDto, network: Network) {
  //const img = TradeShareImage(trade)
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
  post.push(`⛓️ Network: ${network}\n`)
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
      `${Medal(trade.leaderBoard.position)} #${trade.leaderBoard.position} Trader ${formatUSD(
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
  post.push(`<a href='${PositionLink(trade, network)}'>${DisplayTrader(trade, true)}</a>\n`)
  post.push(`============================\n`)
  post.push(
    `<a href='${BlockExplorerLink(trade.transactionHash, network)}'>Trxn</a> | <a href='${TradeHistoryLink(
      trade,
    )}'>History</a> | <a href='${PortfolioLink(trade.account)}'>Portfolio</a> | <a href='${PositionLink(
      trade,
      network,
    )}'>Position</a>\n`,
  )
  post.push(`============================\n`)
  // post.push(`<img src='${img}' />`)
  return post.join('')
}

export function TradeDiscord(trade: TradeDto, network: Network): EmbedBuilder {
  const url = PositionLink(trade, network)
  const tradeEmbed = new EmbedBuilder().setURL(`${url}`)
  const assetThumb = getThumb(trade.asset.toLowerCase())

  if (assetThumb) {
    tradeEmbed.setThumbnail(assetThumb)
  }

  let decimals = 0

  if (trade.asset == 'OP' || trade.asset == 'ARB') {
    decimals = 2
  }

  if (!trade.isLiquidation) {
    tradeEmbed
      .setTitle(
        `${trade.isOpen ? '✅ Opened:' : '🚫 Closed:'} ${trade.isLong ? 'Long' : 'Short'} ${trade.size} ${
          trade.asset
        } $${FN(trade.strike, decimals)} ${trade.isCall ? 'Call' : 'Put'}`,
      )
      .setColor(`${MarketColor(trade.market)}`)
  } else {
    tradeEmbed
      .setTitle(`🔥 Liquidation ${trade.size} $${trade.asset} $${FN(trade.strike, 0)} ${trade.isCall ? 'Call' : 'Put'}`)
      .setColor('#ffa500')
  }

  tradeEmbed.addFields(
    {
      name: `🪙 Market`,
      value: `> ${trade.market}`,
      inline: false,
    },
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
    {
      name: `⛓️ Network`,
      value: `> ${titleCaseWord(network)}`,
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
      value: `> [${DisplayTraderNoEmoji(trade)}](${BlockExplorerAddress(trade.account, network)})`,
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
      value: `> #${trade.leaderBoard.position} ${formatUSD(trade.leaderBoard.realizedPnl)}`,
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
    tradeEmbed.addFields({ name: '🏦 Vault', value: `> [deposit into vault](${trade.url})`, inline: false })
  }

  Footer(tradeEmbed)
  return tradeEmbed
}
