import dayjs from 'dayjs'
import { LYRA_PORTFOLIO, ETHSCAN_TRX_LINK, LYRA_POSITION } from '../utils/secrets'
import { TradeDto } from '../types/tradeDto'
import { MessageEmbed } from 'discord.js'

export function GeneratePost(trade: TradeDto) {
  const formattedDate = dayjs(trade.expiry).format('DD MMM YY').toUpperCase()
  const post: string[] = []

  if (trade.leaderBoard.owner !== '' && trade.leaderBoard.isProfitable) {
    post.push(`${Medal(trade.leaderBoard.index)} #${trade.leaderBoard.index} Trader 💵 $${trade.leaderBoard.balance}\n`)
  }
  post.push(`📈 $${trade.asset} ${formattedDate} ${trade.isCall ? 'CALL' : 'PUT'} $${trade.strike}\n`)
  post.push(`${trade.isOpen ? '✅ OPENED' : '🚫 CLOSED'} ${trade.isLong ? 'LONG' : 'SHORT'} X ${trade.size}\n`)
  post.push(`💵 ${AmountWording(trade.isLong, trade.isOpen)} $${trade.premium}\n`)
  if (ShowProfitAndLoss(trade.positionTradeCount, trade.pnl)) {
    post.push(
      `${trade.isProfitable ? '🟢 ' : '🔴 -'}$${trade.pnl} ${
        trade.isProfitable ? 'PROFIT' : 'LOSS'
      } ${trade.pnlPercent.toFixed(2)}%\n`,
    )
  }
  post.push(`👨‍ ${trade.ens ? trade.ens : trade.trader}\n`)
  post.push(`====\n`)
  post.push(`${ETHSCAN_TRX_LINK}${trade.transactionHash}\n`)
  post.push(`${LYRA_PORTFOLIO}${trade.trader}\n`)
  return post.join('')
}

export function GenerateHtmlPost(trade: TradeDto) {
  const formattedDate = dayjs(trade.expiry).format('DD MMM YY').toUpperCase()
  const post: string[] = []

  if (trade.leaderBoard.owner !== '' && trade.leaderBoard.isProfitable) {
    post.push(`${Medal(trade.leaderBoard.index)} #${trade.leaderBoard.index} Trader 💵 $${trade.leaderBoard.balance}\n`)
  }
  post.push(`📈 $${trade.asset} ${formattedDate} ${trade.isCall ? 'CALL' : 'PUT'} $${trade.strike}\n`)
  post.push(`${trade.isOpen ? '✅ OPENED' : '🚫 CLOSED'} ${trade.isLong ? 'LONG' : 'SHORT'} X ${trade.size}\n`)
  post.push(`💵 ${AmountWording(trade.isLong, trade.isOpen)} $${trade.premium}\n`)
  if (ShowProfitAndLoss(trade.positionTradeCount, trade.pnl)) {
    post.push(
      `${trade.isProfitable ? '🟢 ' : '🔴 -'}$${trade.pnl} ${
        trade.isProfitable ? 'PROFIT' : 'LOSS'
      } ${trade.pnlPercent.toFixed(2)}%\n`,
    )
  }
  post.push(
    `👨‍ <a href='https://optimistic.etherscan.io/address/${trade.trader}'>${
      trade.ens ? trade.ens : trade.trader
    }</a>\n`,
  )
  post.push(`====\n`)
  post.push(`<a href='${ETHSCAN_TRX_LINK}${trade.transactionHash}'>🔗 Transaction</a>\n`)
  post.push(`<a href='${LYRA_PORTFOLIO}${trade.trader}'>📗 Lyra Portfolio</a>\n`)
  return post.join('')
}

export function GenerateEmbed(trade: TradeDto): MessageEmbed {
  const formattedDate = dayjs(trade.expiry).format('DD MMM YY').toUpperCase()
  const tradeDate = dayjs(trade.timeStamp).format('DD MMM YY  |  HH:mm').toUpperCase()

  const tradeEmbed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`${trade.isOpen ? '✅' : '🚫'} Position ${trade.isOpen ? 'opened' : 'closed'} for $${trade.asset}`)
    .setURL(`${LYRA_POSITION}${trade.asset}/${trade.positionId}?see=${trade.trader}`)

  if (trade.leaderBoard.owner !== '' && trade.leaderBoard.isProfitable) {
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
      value: `${formattedDate}`,
      inline: true,
    },
    {
      name: 'Premium',
      value: `💵 $${trade.premium} ${AmountShortWording(trade.isLong, trade.isOpen)}`,
      inline: true,
    },
    {
      name: 'Amount',
      value: `${trade.size}`,
      inline: true,
    },
    {
      name: 'Timestamp',
      value: `${tradeDate}`,
      inline: true,
    },
  )
  tradeEmbed.addField('Trader', `👨‍ ${trade.ens ? trade.ens : trade.trader}`, true)
  if (ShowProfitAndLoss(trade.positionTradeCount, trade.pnl)) {
    tradeEmbed.addField(
      `${trade.isProfitable ? 'Profit' : 'Loss'}`,
      `${trade.isProfitable ? '🟢 ' : '🔴 -'}$${trade.pnl}`,
      true,
    )
    tradeEmbed.addField(`Percent`, `${trade.pnlPercent.toFixed(2)}%`, true)
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

export function AmountWording(isLong: boolean, isOpen: boolean): string {
  const paid = 'PREMIUM PAID'
  const received = "PREMIUM REC'D"

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
