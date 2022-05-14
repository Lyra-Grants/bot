import { lyraClient } from '../clients/lyraClient'
import { Settle } from '../graphql'
import { settlesQuery } from '../queries'

export async function getSettles(lastRunTime: number): Promise<Settle[]> {
  const settles = (
    await lyraClient.query<{ settles: Settle[] }>({
      query: settlesQuery(lastRunTime),
    })
  ).data.settles

  return settles
}
