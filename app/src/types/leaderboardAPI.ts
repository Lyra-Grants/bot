export type LeaderboardData = {
  leaderboard: LeaderboardElement[]
}

export type LeaderboardElement = {
  owner: string
  long_pnl: number
  short_pnl: number
  long_pnl_percent: number
  short_pnl_percent: number
  realized_pnl: number
  unrealized_pnl: number
  initial_cost_of_open: number
  unrealized_pnl_percent: number
}
