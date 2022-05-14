import { ApolloClient, HttpLink, InMemoryCache, InMemoryCacheConfig } from '@apollo/client'
import fetch from 'cross-fetch'
import { GRAPHQL_API } from '../utils/secrets'

export const lyraClient = new ApolloClient({
  link: new HttpLink({
    uri: GRAPHQL_API,
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
