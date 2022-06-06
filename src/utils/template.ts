import dayjs from 'dayjs'
import { TESTNET, AVALON } from '../utils/secrets'
import { TradeDto } from '../types/tradeDto'
import { MessageEmbed } from 'discord.js'
import { trader } from '../types/trader'
import { shortAddress } from './utils'

const zapperUrl = 'https://zapper.fi/account/'
const debankUrl = 'https://debank.com/profile/'

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

  if (AVALON) {
    post.push(`💻 Avalon\n`)
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
  if (AVALON) {
    post.push(`💻 Avalon\n`)
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
    `<a href='${EtherScanTransactionLink(trade)}'>Trxn</a> | <a href='${TradeHistoryLink(
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
  const tradeEmbed = new MessageEmbed().setColor('#0099ff').setURL(`${url}`).setImage(img)

  if (!trade.isLiquidation) {
    tradeEmbed.setTitle(
      `${trade.isOpen ? '✅' : '🚫'} ${trade.isOpen ? 'Open' : 'Close'} ${trade.isLong ? 'Long' : 'Short'} ${
        trade.size
      } $${trade.asset} $${trade.strike} ${trade.isCall ? 'Call' : 'Put'}`,
    )
  } else {
    tradeEmbed.setTitle(
      `🔥 Liquidation ${trade.size} $${trade.asset} $${trade.strike} ${trade.isCall ? 'Call' : 'Put'}`,
    )
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
    {
      name: 'Timestamp',
      value: `${FormattedDateTime(trade.timeStamp)}`,
      inline: true,
    },
  )
  tradeEmbed.addField('Trader', `👨‍ ${trade.ens ? trade.ens : shortAddress(trade.trader)}`, true)
  tradeEmbed.addField('Collateral', `${trade.setCollateralTo ? '💰 ' + trade.baseCollateralFormatted : '-'}`, true)

  if (trade.leaderBoard.owner !== '') {
    tradeEmbed.addField(
      `Leaderboard`,
      `${Medal(trade.leaderBoard.position)} #${trade.leaderBoard.position} ${trade.leaderBoard.netPremiumsFormatted}`,
      true,
    )
  } else {
    tradeEmbed.addField(`Leaderboard`, `-`, true)
  }
  if (ShowProfitAndLoss(trade.positionTradeCount, trade.pnl)) {
    tradeEmbed.addField(
      `${trade.isProfitable ? 'Profit' : 'Loss'}`,
      `${trade.isProfitable ? '🟢' : '🔴'} ${trade.pnlFormatted}`,
      true,
    )
    tradeEmbed.addField(`\u200B`, `${trade.pnlPercentFormatted}`, true)
    tradeEmbed.addField(`\u200B`, `\u200B`, true)
  }

  return tradeEmbed
}

export function ShowProfitAndLoss(positionTradeCount: number, pnl: number): boolean {
  return positionTradeCount > 1 && pnl != 0
}

export function Medal(position: number): string {
  if (position == 1) {
    return '🥇'
  }
  if (position == 2) {
    return '🥈'
  }
  if (position == 3) {
    return '🥉'
  }
  return '🏅'
}

export function AmountWording(isLong: boolean, isOpen: boolean, isLiquidation: boolean): string {
  if (isLiquidation) {
    return 'Amount'
  }
  const paid = 'Premium Paid'
  const received = "Premium Rec'd"

  if (isOpen) {
    return isLong ? paid : received
  }

  return isLong ? received : paid
}

export function AmountShortWording(isLong: boolean, isOpen: boolean, isLiquidation: boolean): string {
  if (isLiquidation) {
    return 'Amount'
  }

  const paid = 'Premium Paid'
  const received = "Premium Rec'd"

  if (isOpen) {
    return isLong ? paid : received
  }

  return isLong ? received : paid
}

export function PositionLink(trade: TradeDto): string {
  return `${LyraDappUrl()}/position/${trade.asset}/${trade.positionId}?see=${trade.trader}`
}

export function PortfolioLink(address: string) {
  return `${LyraDappUrl()}/portfolio?see=${address}`
}

export function TradeHistoryLink(trade: TradeDto) {
  return `${LyraDappUrl()}/portfolio/history?see=${trade.trader}`
}

export function EtherScanTransactionLink(trade: TradeDto) {
  return `${EtherScanUrl()}/tx/${trade.transactionHash}`
}

export function FormattedDate(date: Date) {
  return dayjs(date).format('DD MMM YY')
}

export function FormattedDateTime(date: Date) {
  return dayjs(date).format('DD MMM YY | HH:mm')
}

export function EtherScanUrl() {
  if (TESTNET) {
    return 'https://kovan-optimistic.etherscan.io'
  }
  return 'https://optimistic.etherscan.io'
}

export function LyraDappUrl() {
  if (AVALON) {
    return 'https://avalon.app.lyra.finance'
  }
  return 'https://app.lyra.finance'
}

export function LeaderboardDiscord(leaderBoard: trader[]): MessageEmbed[] {
  const messageEmbeds: MessageEmbed[] = []

  const tradeEmbed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`✅ Top ${leaderBoard.length} ${TESTNET ? 'Kovan' : 'Avalon'} Profitable Traders 💵 💰 🤑 💸`)
    .setDescription(`Last 1000 positions (unrealised profit).`)
    .addField('Trader', '-----------', true)
    .addField('💵 Profit', '-----------', true)
    .addField(`\u200B`, `\u200B`, true)
  //\u200b
  leaderBoard.slice(0, 5).map((trader) => {
    return leaderBoardRow(tradeEmbed, trader)
  })
  messageEmbeds.push(tradeEmbed)

  const traders: trader[] = []

  // skip 5 until end
  leaderBoard.slice(5).reduce((group, trader, index) => {
    group.push(trader)
    if (index % 5 === 4) {
      const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setDescription(`---------------------------------------------------------------`)
      group.map((trader) => {
        return leaderBoardRow(embed, trader)
      })
      messageEmbeds.push(embed)
      group = []
    }
    return group
  }, traders)

  return messageEmbeds
}

export function leaderBoardRow(tradeEmbed: MessageEmbed, trader: trader): MessageEmbed {
  return tradeEmbed
    .addField(
      `${Medal(trader.position)} ${trader.position}.`,
      `${trader.ens ? trader.ens : shortAddress(trader.owner)}`,
      true,
    )
    .addField(
      `${trader.netPremiumsFormatted}`,
      `${trader.openOptionsFormatted == '' ? '(0)' : trader.openOptionsFormatted}`,
      true,
    )
    .addField(`\u200B`, `\u200B`, true)
}

export function LeaderboardTwitter(leaderBoard: trader[]) {
  const post: string[] = []
  post.push(`✅ Top 5 ${TESTNET ? 'Kovan' : 'Avalon'} Profitable Traders 💵 💰 🤑\n`)
  leaderBoard.slice(0, 5).map((trader) => {
    post.push(
      `${Medal(trader.position)} ${trader.position}.  ${trader.ens ? trader.ens : shortAddress(trader.owner)}  💵 ${
        trader.netPremiumsFormatted
      }\n`,
    )
  })
  post.push(`\nOptions for everyone, start trading 👇\n`)
  post.push(`https://app.lyra.finance`)
  return post.join('')
}

export function LeaderboardTelegram(leaderBoard: trader[]) {
  const post: string[] = []
  post.push(`✅ Top 10 ${TESTNET ? 'Kovan' : 'Avalon'} Traders 💵 💰 🤑\n`)
  post.push(`Profits from last 1000 positions.\n`)
  post.push(`============================\n`)
  leaderBoard.slice(0, 10).map((trader) => {
    post.push(
      `${Medal(trader.position)} ${trader.position}. <a href='${PortfolioLink(trader.owner)}'>${
        trader.ens ? trader.ens : shortAddress(trader.owner)
      }</a> ${trader.netPremiumsFormatted}\n`,
    )
  })
  post.push(`============================\n`)
  return post.join('')
}

export function TradeShareImage(trade: TradeDto) {
  return `${LyraDappUrl()}/position/image/${trade.asset}/${trade.positionId}`
}
