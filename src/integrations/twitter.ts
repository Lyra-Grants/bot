import { TradeDto } from '../types/tradeDto'
import { TwitterClient } from '../clients/twitterClient'
import { TWITTER_ENABLED } from '../utils/secrets'
import { GeneratePost } from '../utils/template'

export async function SendTweet(trade: TradeDto) {
  if (TWITTER_ENABLED) {
    const tweet = GeneratePost(trade)
    TwitterClient.readWrite

    try {
      // const response = await TwitterClient.v1.tweet(tweet)
      // console.log(response.id)
    } catch (e: any) {
      console.log(e)
    }
  }
}
