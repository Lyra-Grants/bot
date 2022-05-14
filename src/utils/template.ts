import dayjs from 'dayjs'
import { LYRA_PORTFOLIO, ETHSCAN_TRX_LINK } from '../utils/secrets'
import { TradeDto } from '../types/tradeDto'

export function GeneratePost(trade: TradeDto) {
  const formattedDate = dayjs(trade.expiry).format('DD MMM YY').toUpperCase()
  const post: string[] = []

  if (trade.leaderBoard.owner !== '' && trade.leaderBoard.isProfitable) {
    post.push(`${Medal(trade.leaderBoard.index)} #${trade.leaderBoard.index} Trader 💵 $${trade.leaderBoard.balance}\n`)
  }
  post.push(`📈 $${trade.asset} ${formattedDate} ${trade.isCall ? 'CALL' : 'PUT'} $${trade.strike}\n`)
  post.push(`${trade.isOpen ? '✅ OPENED' : '🚫 CLOSED'} ${trade.isLong ? 'LONG' : 'SHORT'} X ${trade.size}\n`)
  post.push(`💵 ${AmountWording(trade.isLong, trade.isOpen)} $${trade.premium}\n`)
  if (ShowProfitAndLoss(trade.isLong, trade.isBuy)) {
    post.push(
      `${trade.isProfitable ? '🟢 ' : '🔴 -'}$${trade.pnl} ${trade.isProfitable ? 'PROFIT' : 'LOSS'} ${
        trade.pnlPercent
      }%\n`,
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
  if (ShowProfitAndLoss(trade.isLong, trade.isBuy)) {
    post.push(
      `${trade.isProfitable ? '🟢 ' : '🔴 -'}$${trade.pnl} ${trade.isProfitable ? 'PROFIT' : 'LOSS'} ${
        trade.pnlPercent
      }%\n`,
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

export function ShowProfitAndLoss(isLong: boolean, isBuy: boolean): boolean {
  if (isLong) {
    return !isBuy
  }
  return isBuy
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
