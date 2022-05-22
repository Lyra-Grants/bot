import dayjs from 'dayjs'
import { TESTNET, AVALON } from '../utils/secrets'
import { TradeDto } from '../types/tradeDto'
import { MessageEmbed } from 'discord.js'
import { trader } from '../types/trader'

const zapperUrl = 'https://zapper.fi/account/'
const debankUrl = 'https://debank.com/profile/'

// TWITTER //
export function TradeTwitter(trade: TradeDto) {
  const post: string[] = []

  post.push(`📈 $${trade.asset} ${FormattedDate(trade.expiry)} ${trade.isCall ? 'Call' : 'Put'} $${trade.strike}\n`)
  post.push(`${trade.isOpen ? '✅ Opened' : '🚫 Closed'} ${trade.isLong ? 'Long' : 'Short'} X ${trade.size}\n`)
  post.push(`💵 ${AmountWording(trade.isLong, trade.isOpen)} $${trade.premium}\n`)
  post.push(`💻 Avalon\n`)
  post.push(`⏰ ${FormattedDate(trade.expiry)}\n`)
  if (ShowProfitAndLoss(trade.positionTradeCount, trade.pnl)) {
    post.push(
      `${trade.isProfitable ? '🟢 ' : '🔴 -'}$${trade.pnl} ${
        trade.isProfitable ? 'Profit' : 'Loss'
      } ${trade.pnlPercent.toFixed(2)}%\n`,
    )
  }
  if (trade.leaderBoard.owner !== '') {
    post.push(
      `${Medal(trade.leaderBoard.position)} #${trade.leaderBoard.position} Trader 💵 $${trade.leaderBoard.balance}\n`,
    )
  }
  post.push(`👨‍ ${trade.ens ? trade.ens : trade.trader}\n`)
  post.push(`${PositionLink(trade)}\n`)
  return post.join('')
}

// TELEGRAM //
export function TradeTelegram(trade: TradeDto) {
  const post: string[] = []
  post.push(`📈 ${trade.asset} ${FormattedDate(trade.expiry)} ${trade.isCall ? 'Call' : 'Put'} $${trade.strike}\n`)
  post.push(`${trade.isOpen ? '✅ Opened' : '🚫 Closed'} ${trade.isLong ? 'Long' : 'Short'} X ${trade.size}\n`)
  post.push(`💵 ${AmountWording(trade.isLong, trade.isOpen)} $${trade.premium}\n`)
  post.push(`💻 Avalon\n`)
  post.push(`⏰ ${FormattedDate(trade.expiry)}\n`)
  if (ShowProfitAndLoss(trade.positionTradeCount, trade.pnl)) {
    post.push(
      `${trade.isProfitable ? '🟢 ' : '🔴 -'}$${trade.pnl} ${
        trade.isProfitable ? 'Profit' : 'Loss'
      } ${trade.pnlPercent.toFixed(2)}%\n`,
    )
  }
  if (trade.leaderBoard.owner !== '') {
    post.push(
      `${Medal(trade.leaderBoard.position)} #${trade.leaderBoard.position} Trader 💵 $${trade.leaderBoard.balance}\n`,
    )
  }
  post.push(`👨‍ <a href='${zapperUrl}${trade.trader}'>${trade.ens ? trade.ens : trade.trader}</a>\n`)
  post.push(`============================\n`)
  post.push(
    `<a href='${EtherScanTransactionLink(trade)}'>Trxn</a> | <a href='${TradeHistoryLink(
      trade,
    )}'>History</a> | <a href='${PositionLink(trade)}'>Position</a> | <a href='${PortfolioLink(
      trade,
    )}'>Portfolio</a>\n`,
  )
  post.push(`============================\n`)
  post.push(`⏱️ ${FormattedDateTime(trade.timeStamp)}\n`)
  return post.join('')
}

// DISCORD //
export function TradeDiscord(trade: TradeDto): MessageEmbed {
  const url = PositionLink(trade)
  const tradeEmbed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(
      `${trade.isOpen ? '✅' : '🚫'} ${trade.isOpen ? 'Open' : 'Close'} ${trade.isLong ? 'Long' : 'Short'} ${
        trade.size
      } $${trade.asset} $${trade.strike} ${trade.isCall ? 'Call' : 'Put'}`,
    )
    .setURL(`${url}`)

  if (trade.leaderBoard.owner !== '') {
    tradeEmbed
      .addField(`Leaderboard`, `${Medal(trade.leaderBoard.position)} #${trade.leaderBoard.position} Trader`, true)
      .addField('Total Profit', `$${trade.leaderBoard.balance}`, true)
      .addField('\u200B', '\u200B', true)
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
      name: `Premium ${AmountShortWording(trade.isLong, trade.isOpen)}`,
      value: `💵 $${trade.premium}`,
      inline: true,
    },
    {
      name: 'Amount',
      value: `${trade.size}`,
      inline: true,
    },
    {
      name: 'Timestamp',
      value: `${FormattedDateTime(trade.timeStamp)}`,
      inline: true,
    },
  )

  if (ShowProfitAndLoss(trade.positionTradeCount, trade.pnl)) {
    tradeEmbed.addField(
      `${trade.isProfitable ? 'Profit' : 'Loss'}`,
      `${trade.isProfitable ? '🟢 ' : '🔴 -'}$${trade.pnl}`,
      true,
    )
    tradeEmbed.addField(`Percent`, `${trade.pnlPercent.toFixed(2)}%`, true)
    if (!trade.ens) {
      tradeEmbed.addField('\u200B', '\u200B', true)
    }
  }
  const embed = trade.ens ? true : false
  tradeEmbed.addField('Trader', `👨‍ ${trade.ens ? trade.ens : trade.trader}`, embed)
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

export function AmountWording(isLong: boolean, isOpen: boolean): string {
  const paid = 'Premium Paid'
  const received = "Premium Rec'd"

  if (isOpen) {
    return isLong ? paid : received
  }

  return isLong ? received : paid
}

export function AmountShortWording(isLong: boolean, isOpen: boolean): string {
  const paid = 'Paid'
  const received = "Rec'd"

  if (isOpen) {
    return isLong ? paid : received
  }

  return isLong ? received : paid
}

export function PositionLink(trade: TradeDto): string {
  return `${LyraDappUrl()}/position/${trade.asset}/${trade.positionId}?see=${trade.trader}`
}

export function PortfolioLink(trade: TradeDto) {
  return `${LyraDappUrl()}/portfolio?see=${trade.trader}`
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
  const tradeEmbed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`✅ Top 10 ${TESTNET ? 'Kovan' : 'Avalon'} Profitable Traders 💵 💰 🤑 💸`)
    .setDescription(`Calculated from last 1000 positions.`)
  leaderBoard.slice(0, 5).map((trader) => {
    tradeEmbed
      .addField(
        `-------------------------------------------------------------------------------------`,
        `${Medal(trader.position)} #${trader.position} ${trader.ens ? trader.ens : trader.owner}`,
        false,
      )
      .addField('Premiums', `$${trader.netPremiums.toFixed(2)}`, true)
      .addField('Open Options Value', `$${trader.openOptionsValue.toFixed()}`, true)
      .addField('Profit', `💵 $${trader.balance.toFixed(2)}`, true)
  })

  const tradeEmbed2 = new MessageEmbed().setColor('#0099ff')
  leaderBoard.slice(5, 10).map((trader) => {
    tradeEmbed2
      .addField(
        `-------------------------------------------------------------------------------------`,
        `${Medal(trader.position)} #${trader.position} ${trader.ens ? trader.ens : trader.owner}`,
        false,
      )
      .addField('Premiums', `$${trader.netPremiums.toFixed(2)}`, true)
      .addField('Open Options Value', `$${trader.openOptionsValue.toFixed()}`, true)
      .addField('Profit', `💵 $${trader.balance.toFixed(2)}`, true)
  })

  return [tradeEmbed, tradeEmbed2]
}
