import { TypedDocumentNode } from '@apollo/client'
import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { Position, Trade, Settle } from './graphql'

//  where: { timestamp_gte: ${lastRunTime} }
//  trades(orderBy: timestamp, orderDirection: desc, first: 20) {
//  where: { trader: "<ADDRESS>" }

export function leaderboardTradesQuery(): TypedDocumentNode<{ trades: Trade[] | DocumentNode }> {
  return gql`
    query trades {
      trades(first: 1000, orderBy: timestamp, orderDirection: desc) {
        trader
        premium
        isBuy
        position {
          isLong
        }
      }
    }
  `
}

export function positionsQuery(): TypedDocumentNode<{ positions: Position[] | DocumentNode }> {
  return gql`
    query positions {
      positions(first: 1000, orderBy: size, orderDirection: desc, where: { state: 1 }) {
        owner
        collateral
        size
        isLong
        option {
          latestOptionPriceAndGreeks {
            optionPrice
          }
        }
      }
    }
  `
}

export function settlesQuery(lastRunTime: number): TypedDocumentNode<{ settles: Settle[] | DocumentNode }> {
  return gql`
    query settles{
      settles(orderBy: timestamp, orderDirection: asc,  where: { timestamp_gte: ${lastRunTime} }) {
        id
        transactionHash
        owner
        size
        spotPriceAtExpiry
        timestamp
        position {
          isLong
          averageCostPerOption
          size
          option {
            latestOptionPriceAndGreeks {
              optionPrice
            }
            strike {
              strikePrice
            }
            isCall
            board {
              expiryTimestamp
            }
          }
          trades {
            size
            premium
            isOpen
            isBuy
          }
        }
      }
    }
  `
}
