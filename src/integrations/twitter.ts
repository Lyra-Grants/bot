import { TradeDto } from '../types/tradeDto'
import { TWITTER_ENABLED } from '../utils/secrets'
import { GeneratePost } from '../utils/template'
import { TwitterApi } from 'twitter-api-v2'

export async function SendTweet(trade: TradeDto, twitterApi: TwitterApi) {
  try {
    const tweet = GeneratePost(trade)
    const response = await twitterApi.v1.tweet(tweet)
    console.log(response.id)
  } catch (e: any) {
    console.log(e)
  }
}
