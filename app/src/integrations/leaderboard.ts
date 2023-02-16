import { Network } from '@lyrafinance/lyra-js'
import axios from 'axios'
import { urls } from '../constants/urls'
import { LeaderboardData } from '../types/leaderboardAPI'

export const GetLeaderboardAPI = async () => {
  const networks = [Network.Arbitrum, Network.Optimism]
  networks.map(async (network) => {
    if (network == Network.Arbitrum) {
      try {
        const leaderboardData = (await axios.get(`${urls.leaderboardApiUrl}?chain=arbitrum-mainnet`))
          .data as LeaderboardData
        global.LEADERBOARD_ARB = leaderboardData.leaderboard
      } catch (ex) {
        global.LEADERBOARD_ARB = []
        console.log(ex)
      }
    } else {
      try {
        const leaderboardData = (await axios.get(`${urls.leaderboardApiUrl}`)).data as LeaderboardData
        global.LEADERBOARD_OPT = leaderboardData.leaderboard
      } catch (ex) {
        global.LEADERBOARD_OPT = []
        console.log(ex)
      }
    }
  })
}
