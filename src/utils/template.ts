import dayjs from 'dayjs'
import { LYRA_URL, ETHSCAN_URL, ZAPPER_LINK } from '../utils/secrets'
import { TradeDto } from '../types/tradeDto'
import { MessageEmbed } from 'discord.js'

// TWITTER //
export function GeneratePost(trade: TradeDto) {
  const post: string[] = []

  if (trade.leaderBoard.owner !== '') {
    post.push(`${Medal(trade.leaderBoard.index)} #${trade.leaderBoard.index} Trader 💵 $${trade.leaderBoard.balance}\n`)
  }
  post.push(`📈 $${trade.asset} ${FormattedDate(trade.expiry)} ${trade.isCall ? 'Call' : 'Put'} $${trade.strike}\n`)
  post.push(`${trade.isOpen ? '✅ Opened' : '🚫 Closed'} ${trade.isLong ? 'Long' : 'Short'} X ${trade.size}\n`)
  post.push(`💵 ${AmountWording(trade.isLong, trade.isOpen)} $${trade.premium}\n`)
  if (ShowProfitAndLoss(trade.positionTradeCount, trade.pnl)) {
    post.push(
      `${trade.isProfitable ? '🟢 ' : '🔴 -'}$${trade.pnl} ${
        trade.isProfitable ? 'Profit' : 'Loss'
      } ${trade.pnlPercent.toFixed(2)}%\n`,
    )
  }
  post.push(`👨‍ ${trade.ens ? trade.ens : trade.trader}\n`)
  post.push(`${PositionLink(trade)}\n`)
  return post.join('')
}

// TELEGRAM //
export function GenerateHtmlPost(trade: TradeDto) {
  const post: string[] = []

  if (trade.leaderBoard.owner !== '') {
    post.push(`${Medal(trade.leaderBoard.index)} #${trade.leaderBoard.index} Trader 💵 $${trade.leaderBoard.balance}\n`)
  }
  post.push(`📈 ${trade.asset} ${FormattedDate(trade.expiry)} ${trade.isCall ? 'Call' : 'Put'} $${trade.strike}\n`)
  post.push(`${trade.isOpen ? '✅ Opened' : '🚫 Closed'} ${trade.isLong ? 'Long' : 'Short'} X ${trade.size}\n`)
  post.push(`💵 ${AmountWording(trade.isLong, trade.isOpen)} $${trade.premium}\n`)
  if (ShowProfitAndLoss(trade.positionTradeCount, trade.pnl)) {
    post.push(
      `${trade.isProfitable ? '🟢 ' : '🔴 -'}$${trade.pnl} ${
        trade.isProfitable ? 'Profit' : 'Loss'
      } ${trade.pnlPercent.toFixed(2)}%\n`,
    )
  }
  post.push(`👨‍ <a href='${ZAPPER_LINK}${trade.trader}'>${trade.ens ? trade.ens : trade.trader}</a>\n`)
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

export function GenerateEmbed(trade: TradeDto): MessageEmbed {
  const url = PositionLink(trade)
  const tradeEmbed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`${trade.isOpen ? '✅' : '🚫'} Position ${trade.isOpen ? 'opened' : 'closed'} for $${trade.asset}`)
    .setURL(`${url}`)

  if (trade.leaderBoard.owner !== '') {
    tradeEmbed
      .addField(`Leaderboard`, `${Medal(trade.leaderBoard.index)} #${trade.leaderBoard.index} Trader`, true)
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
  return `${LYRA_URL}/position/${trade.asset}/${trade.positionId}?see=${trade.trader}`
}

export function PortfolioLink(trade: TradeDto) {
  return `${LYRA_URL}/portfolio?see=${trade.trader}`
}

export function TradeHistoryLink(trade: TradeDto) {
  return `${LYRA_URL}/portfolio/history?see=${trade.trader}`
}

export function EtherScanTransactionLink(trade: TradeDto) {
  return `${ETHSCAN_URL}/tx/${trade.transactionHash}`
}

export function FormattedDate(date: Date) {
  return dayjs(date).format('DD MMM YY')
}

export function FormattedDateTime(date: Date) {
  return dayjs(date).format('DD MMM YY | HH:mm')
}
