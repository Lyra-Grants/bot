import { apolloClient } from '../clients/apolloClient'
import { Settle } from '../graphql'
import { settlesQuery } from '../queries'

export async function getSettles(lastRunTime: number): Promise<Settle[]> {
  const settles = (
    await apolloClient.query<{ settles: Settle[] }>({
      query: settlesQuery(lastRunTime),
    })
  ).data.settles

  return settles
}
