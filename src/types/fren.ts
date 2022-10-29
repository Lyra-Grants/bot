export type FrenData = {
  frens: Fren[]
  count: number
  response_time: number
}

export type Fren = {
  id: string
  name: string
  ens: string
  handle: string
  followers: number
  verified: boolean
  updated: Date
  pfp: string
  ranking: number
}
