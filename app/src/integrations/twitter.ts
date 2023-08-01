import { TwitterApi } from 'twitter-api-v2'
import { TESTNET, TWITTER_ENABLED } from '../config'

export async function SendTweet(tweet: string, twitterApi: TwitterApi) {
  if (TESTNET || !TWITTER_ENABLED) {
    console.log(tweet)
  } else {
    try {
      const response = await twitterApi.v2.tweet(tweet)
      console.log(response?.data?.id)
    } catch (e: any) {
      console.log(e)
    }
  }
}
