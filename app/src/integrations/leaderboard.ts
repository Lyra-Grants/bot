import axios from 'axios'
import { urls } from '../constants/urls'

import { LeaderboardData } from '../types/leaderboardAPI'

export const GetLeaderboardAPI = async () => {
  try {
    const leaderboardData = (await axios.get(`${urls.leaderboardApiUrl}`)).data as LeaderboardData
    global.LEADERBOARD_DATA = leaderboardData.leaderboard
  } catch (ex) {
    global.LEADERBOARD_DATA = []
    console.log(ex)
  }
}
