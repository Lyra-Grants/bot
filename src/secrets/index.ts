import * as dotenv from 'dotenv'
import * as _ from 'lodash'
import { convertToBoolean } from '../utils/utils'

dotenv.config({ path: '.env' })

export const INFURA_ID = _.defaultTo(process.env.INFURA_ID, '')
export const INFURA_ID_OPTIMISM = _.defaultTo(process.env.INFURA_ID_OPTIMISM, '')

export const TWITTER_APP_KEY = _.defaultTo(process.env.TWITTER_APP_KEY, '')
export const TWITTER_APP_SECRET = _.defaultTo(process.env.TWITTER_APP_SECRET, '')
export const TWITTER_ACCESS_TOKEN = _.defaultTo(process.env.TWITTER_ACCESS_TOKEN, '')
export const TWITTER_ACCESS_SECRET = _.defaultTo(process.env.TWITTER_ACCESS_SECRET, '')

export const TWITTER_THRESHOLD = _.defaultTo(process.env.TWITTER_THRESHOLD, 100)
export const TELEGRAM_THRESHOLD = _.defaultTo(process.env.TELEGRAM_THRESHOLD, 100)
export const DISCORD_THRESHOLD = _.defaultTo(process.env.DISCORD_THRESHOLD, 0)

export const TWITTER_ENABLED: boolean = _.defaultTo(
  convertToBoolean(process.env.TWITTER_ENABLED as string),
  false,
) as boolean
export const TELEGRAM_ENABLED: boolean = _.defaultTo(
  convertToBoolean(process.env.TELEGRAM_ENABLED as string),
  true,
) as boolean
export const DISCORD_ENABLED: boolean = _.defaultTo(
  convertToBoolean(process.env.DISCORD_ENABLED as string),
  true,
) as boolean

export const TELEGRAM_ACCESS_TOKEN = _.defaultTo(process.env.TELEGRAM_ACCESS_TOKEN, '')
export const TELEGRAM_CHANNEL = _.defaultTo(process.env.TELEGRAM_CHANNEL, '')
export const DISCORD_ACCESS_TOKEN = _.defaultTo(process.env.DISCORD_ACCESS_TOKEN, '')
export const DISCORD_CHANNEL_ID = _.defaultTo(process.env.DISCORD_CHANNEL_ID, '')
export const TESTNET: boolean = _.defaultTo(convertToBoolean(process.env.TESTNET as string), true) as boolean
export const AVALON: boolean = _.defaultTo(convertToBoolean(process.env.AVALON as string), true) as boolean
export const ENTROPY = _.defaultTo(process.env.ENTROPY, '')

export const TEST_WALLET_ADDRESS = _.defaultTo(process.env.TEST_WALLET_ADDRESS, '')
export const TEST_PRIVATE_KEY = _.defaultTo(process.env.TEST_PRIVATE_KEY, '')
export const TEST_PUBLIC_KEY = _.defaultTo(process.env.TEST_PUBLIC_KEY, '')

/* use these details for the token / lp twitter client */
export const TWITTER_APP_KEY1 = _.defaultTo(process.env.TWITTER_APP_KEY1, '')
export const TWITTER_APP_SECRET1 = _.defaultTo(process.env.TWITTER_APP_SECRET1, '')
export const TWITTER_ACCESS_TOKEN1 = _.defaultTo(process.env.TWITTER_ACCESS_TOKEN1, '')
export const TWITTER_ACCESS_SECRET1 = _.defaultTo(process.env.TWITTER_ACCESS_SECRET1, '')

/* Lyra Quant */
export const TWITTER_APP_KEY2 = _.defaultTo(process.env.TWITTER_APP_KEY2, '')
export const TWITTER_APP_SECRET2 = _.defaultTo(process.env.TWITTER_APP_SECRET2, '')
export const TWITTER_ACCESS_TOKEN2 = _.defaultTo(process.env.TWITTER_ACCESS_TOKEN2, '')
export const TWITTER_ACCESS_SECRET2 = _.defaultTo(process.env.TWITTER_ACCESS_SECRET2, '')

export const TOKEN_THRESHOLD = _.defaultTo(process.env.TOKEN_THRESHOLD, 1000)
export const DEPOSIT_THRESHOLD = _.defaultTo(process.env.DEPOSIT_THRESHOLD, 1000)

export const QUANT_TRADE_THRESHOLD = _.defaultTo(process.env.QUANT_TRADE_THESHOLD, 5000)
export const QUANT_TOKEN_THRESHOLD = _.defaultTo(process.env.QUANT_TOKEN_THRESHOLD, 50000)
export const QUANT_DEPOSIT_THRESHOLD = _.defaultTo(process.env.QUANT_DEPOSIT_THRESHOLD, 50000)
