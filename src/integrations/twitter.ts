import { TradeDto } from '../types/tradeDto'
import { TwitterClient } from '../clients/twitterClient'
import dayjs from 'dayjs'
import { LYRA_PORTFOLIO, ETHSCAN_TRX_LINK } from '../utils/secrets'

export async function SendTweet(trade: TradeDto) {
  const tweet = GenerateTweet(trade)
  console.log(tweet)
  TwitterClient.readWrite

  try {
    // const response = await TwitterClient.v1.tweet(tweet)
    // console.log(response.id)
  } catch (e: any) {
    console.log(e)
  }
}

export function GenerateTweet(trade: TradeDto) {
  const formattedDate = dayjs(trade.expiry).format('DD MMM YY').toUpperCase()
  const tweet: string[] = []

  if (trade.leaderBoard.owner !== '' && trade.leaderBoard.isProfitable) {
    tweet.push(
      `${Medal(trade.leaderBoard.index)} #${trade.leaderBoard.index} Trader 💵 $${trade.leaderBoard.balance}\n`,
    )
  }
  tweet.push(`📈 $${trade.asset} ${formattedDate} ${trade.isCall ? 'CALL' : 'PUT'} $${trade.strike}\n`)
  tweet.push(`${trade.isOpen ? '✅ OPENED' : '🚫 CLOSED'} ${trade.isLong ? 'LONG' : 'SHORT'} X ${trade.size}\n`)
  tweet.push(`💵 ${AmountWording(trade.isLong, trade.isOpen)} $${trade.premium}\n`)
  if (ShowProfitAndLoss(trade.isLong, trade.isBuy)) {
    tweet.push(
      `${trade.isProfitable ? '🟢 ' : '🔴 -'}$${trade.pnl} ${trade.isProfitable ? 'PROFIT' : 'LOSS'} ${
        trade.pnlPercent
      }%\n`,
    )
  }
  tweet.push(`👨‍ ${trade.ens ? trade.ens : trade.trader}\n`)
  tweet.push(`====\n`)
  tweet.push(`${ETHSCAN_TRX_LINK}${trade.transactionHash}\n`)
  tweet.push(`${LYRA_PORTFOLIO}${trade.trader}\n`)
  return tweet.join('')
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
