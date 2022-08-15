import { TwitterApi } from 'twitter-api-v2'
import {
  TWITTER_APP_KEY,
  TWITTER_APP_SECRET,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_SECRET,
  TWITTER_APP_KEY1,
  TWITTER_APP_SECRET1,
  TWITTER_ACCESS_TOKEN1,
  TWITTER_ACCESS_SECRET1,
  TWITTER_APP_KEY2,
  TWITTER_APP_SECRET2,
  TWITTER_ACCESS_TOKEN2,
  TWITTER_ACCESS_SECRET2,
} from '../secrets'

export const TwitterClient = new TwitterApi({
  appKey: TWITTER_APP_KEY,
  appSecret: TWITTER_APP_SECRET,
  accessToken: TWITTER_ACCESS_TOKEN,
  accessSecret: TWITTER_ACCESS_SECRET,
})

export const TwitterClient1 = new TwitterApi({
  appKey: TWITTER_APP_KEY1,
  appSecret: TWITTER_APP_SECRET1,
  accessToken: TWITTER_ACCESS_TOKEN1,
  accessSecret: TWITTER_ACCESS_SECRET1,
})

export const TwitterClient2 = new TwitterApi({
  appKey: TWITTER_APP_KEY2,
  appSecret: TWITTER_APP_SECRET2,
  accessToken: TWITTER_ACCESS_TOKEN2,
  accessSecret: TWITTER_ACCESS_SECRET2,
})
