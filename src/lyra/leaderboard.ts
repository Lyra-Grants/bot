import { apolloClient } from '../clients/apolloClient'
import { Position, Trade } from '../graphql'
import { leaderboardTradesQuery, positionsQuery } from '../queries'
import { indexedTrader, trader } from '../types/trader'
import { NetPremiums, OpenOptionValue } from './helper'

async function GetLeaderBoardTrades(): Promise<Trade[]> {
  const trades = (
    await apolloClient.query<{ trades: Trade[] }>({
      query: leaderboardTradesQuery(),
    })
  ).data.trades
  return trades
}

async function GetLeaderBoardPositions(): Promise<Position[]> {
  const positions = (
    await apolloClient.query<{ positions: Position[] }>({
      query: positionsQuery(),
    })
  ).data.positions
  return positions
}

export async function GetLeaderBoard() {
  const trades = await GetLeaderBoardTrades()
  const positions = await GetLeaderBoardPositions()
  const owners = Array.from(new Set(Object.values(trades).map((val) => <string>val.trader.toLowerCase())))

  const traders: trader[] = owners
    .map((owner) => {
      const userTrades = trades.filter((trade) => trade.trader.toLowerCase() === owner)
      const netPremiums = NetPremiums(userTrades)
      const userPositions = positions.filter((position) => position.owner.toLowerCase() === owner)
      const openOptionsValue = userPositions.reduce((sum, position) => {
        const optionValue = OpenOptionValue(position)
        return sum + optionValue
      }, 0)
      const balance = netPremiums + openOptionsValue
      const trader: trader = {
        owner: owner,
        balance: balance,
        netPremiums: netPremiums,
        openOptionsValue: openOptionsValue,
        isProfitable: balance > 0,
      }
      return trader
    })
    .sort((a, b) => b.balance - a.balance)

  return traders
}

export function MapLeaderBoard(leaderboard: trader[], traderAddress: string): indexedTrader {
  const EMPTY: indexedTrader = {
    owner: '',
    balance: 0,
    netPremiums: 0,
    openOptionsValue: 0,
    index: 0,
    isProfitable: false,
  }

  const index = leaderboard.findIndex((leaderboard) => leaderboard.owner.toLowerCase() === traderAddress.toLowerCase())

  if (index === -1) {
    console.log('Trader not on leaderboard')
    return EMPTY
  }

  const result = leaderboard[index]

  const mappedResult: indexedTrader = {
    owner: result.owner,
    balance: Math.floor(result.balance),
    netPremiums: result.netPremiums,
    openOptionsValue: result.openOptionsValue,
    index: index + 1,
    isProfitable: result.isProfitable,
  }

  return mappedResult
}
