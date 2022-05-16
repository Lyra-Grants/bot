import * as dotenv from 'dotenv'
import * as _ from 'lodash'
import { convertToBoolean } from './utils'

dotenv.config({ path: '.env' })

export const GRAPHQL_API = _.defaultTo(process.env.GRAPHQL_API, '')
export const INFURA_ID = _.defaultTo(process.env.INFURA_ID, '')
export const TWITTER_APP_KEY = _.defaultTo(process.env.TWITTER_APP_KEY, '')
export const TWITTER_APP_SECRET = _.defaultTo(process.env.TWITTER_APP_SECRET, '')
export const TWITTER_ACCESS_TOKEN = _.defaultTo(process.env.TWITTER_ACCESS_TOKEN, '')
export const TWITTER_ACCESS_SECRET = _.defaultTo(process.env.TWITTER_ACCESS_SECRET, '')
export const LYRA_PORTFOLIO = _.defaultTo(process.env.LYRA_PORTFOLIO, 'https://avalon.app.lyra.finance/portfolio?see=')
export const LYRA_POSITION = _.defaultTo(process.env.LYRA_POSITION, 'https://avalon.app.lyra.finance/position/')
export const ETHSCAN_TRX_LINK = _.defaultTo(process.env.ETHSCAN_TRX_LINK, 'https://kovan-optimistic.etherscan.io/tx/')
export const ZAPPER_LINK = _.defaultTo(process.env.ZAPPER_LINK, 'https://zapper.fi/account/')
export const DEBANK_LINK = _.defaultTo(process.env.DEBANK_LINK, 'https://debank.com/profile/')
export const PREMIUM_THRESHOLD = _.defaultTo(process.env.PREMIUM_THRESHOLD, 0)
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
