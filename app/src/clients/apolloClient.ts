import { ApolloClient, HttpLink, InMemoryCache, InMemoryCacheConfig } from '@apollo/client'
import fetch from 'cross-fetch'
import { TESTNET } from '../config'

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: graphUrl(),
    fetch,
  }),
  cache: new InMemoryCache(),
  queryDeduplication: false,
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
    },
  },
})

export function graphUrl(): string {
  const baseUrl = 'https://api.thegraph.com/subgraphs/name/lyra-finance'
  if (TESTNET) {
    return `${baseUrl}/kovan`
  }
  return `${baseUrl}/mainnet`
}
