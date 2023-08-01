import * as dotenv from 'dotenv'
import * as _ from 'lodash'
import { convertToBoolean } from '../utils/utils'

dotenv.config({ path: '.env' })

export const ALCHEMY_PROJECT_ID_OPTIMISM = _.defaultTo(process.env.ALCHEMY_PROJECT_ID_OPTIMISM, '')
export const ALCHEMY_PROJECT_ID_ARBITRUM = _.defaultTo(process.env.ALCHEMY_PROJECT_ID_ARBITRUM, '')
export const ALCHEMY_PROJECT_ID_OPTIMISM_TESTNET = _.defaultTo(process.env.ALCHEMY_PROJECT_ID_OPTIMISM_TESTNET, '')
export const ALCHEMY_PROJECT_ID_ARBITRUM_TESTNET = _.defaultTo(process.env.ALCHEMY_PROJECT_ID_ARBITRUM_TESTNET, '')
export const ALCHEMY_PROJECT_ID_MAINNET = _.defaultTo(process.env.ALCHEMY_PROJECT_ID_MAINNET, '')

export const LOG_TOKEN = _.defaultTo(process.env.LOG_TOKEN, '')
export const LOG_CHANNEL = _.defaultTo(process.env.LOG_CHANNEL, '')

export const TWITTER_APP_KEY = _.defaultTo(process.env.TWITTER_APP_KEY, '')
export const TWITTER_APP_SECRET = _.defaultTo(process.env.TWITTER_APP_SECRET, '')
export const TWITTER_ACCESS_TOKEN = _.defaultTo(process.env.TWITTER_ACCESS_TOKEN, '')
export const TWITTER_ACCESS_SECRET = _.defaultTo(process.env.TWITTER_ACCESS_SECRET, '')

export const TWITTER_THRESHOLD = _.defaultTo(process.env.TWITTER_THRESHOLD, 100)
export const TELEGRAM_THRESHOLD = _.defaultTo(process.env.TELEGRAM_THRESHOLD, 100)
export const DISCORD_THRESHOLD = _.defaultTo(process.env.DISCORD_THRESHOLD, 250)

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

export const DISCORD_ACCESS_TOKEN_ETH = _.defaultTo(process.env.DISCORD_ACCESS_TOKEN_ETH, '')
export const DISCORD_ACCESS_TOKEN_BTC = _.defaultTo(process.env.DISCORD_ACCESS_TOKEN_BTC, '')
export const DISCORD_ACCESS_TOKEN_LYRA = _.defaultTo(process.env.DISCORD_ACCESS_TOKEN_LYRA, '')
export const DISCORD_ACCESS_TOKEN_ARB = _.defaultTo(process.env.DISCORD_ACCESS_TOKEN_ARB, '')
export const DISCORD_ACCESS_TOKEN_OP = _.defaultTo(process.env.DISCORD_ACCESS_TOKEN_OP, '')

export const TESTNET: boolean = _.defaultTo(convertToBoolean(process.env.TESTNET as string), true) as boolean
export const ENTROPY = _.defaultTo(process.env.ENTROPY, '')

export const TEST_WALLET_ADDRESS = _.defaultTo(process.env.TEST_WALLET_ADDRESS, '')
export const TEST_PRIVATE_KEY = _.defaultTo(process.env.TEST_PRIVATE_KEY, '')
export const TEST_PUBLIC_KEY = _.defaultTo(process.env.TEST_PUBLIC_KEY, '')

/* use these details for the token / lp twitter client */
export const TWITTER_APP_KEY1 = _.defaultTo(process.env.TWITTER_APP_KEY1, '')
export const TWITTER_APP_SECRET1 = _.defaultTo(process.env.TWITTER_APP_SECRET1, '')
export const TWITTER_ACCESS_TOKEN1 = _.defaultTo(process.env.TWITTER_ACCESS_TOKEN1, '')
export const TWITTER_ACCESS_SECRET1 = _.defaultTo(process.env.TWITTER_ACCESS_SECRET1, '')
export const SATSUMA_API_KEY = _.defaultTo(process.env.SATSUMA_API_KEY, '')
export const TOKEN_THRESHOLD = _.defaultTo(process.env.TOKEN_THRESHOLD, 1000)
export const DEPOSIT_THRESHOLD = _.defaultTo(process.env.DEPOSIT_THRESHOLD, 1000)
