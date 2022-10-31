import Lyra, { Market } from '@lyrafinance/lyra-js'
import { SendTweet } from '../integrations/twitter'
import { StatDto, TradeDto, Trader } from '../types/lyra'
import {
  DISCORD_ENABLED,
  TELEGRAM_ENABLED,
  TWITTER_ENABLED,
  TWITTER_THRESHOLD,
  TELEGRAM_THRESHOLD,
  DISCORD_THRESHOLD,
  TESTNET,
} from '../secrets'
import { dollar, GetUrl, signed, toDate } from '../utils/utils'
import { TradeEvent } from '@lyrafinance/lyra-js'
import { FindOnLeaderBoard } from './leaderboard'
import { GetEns } from '../integrations/ens'
import { PostTelegram } from '../integrations/telegram'
import { PostDiscord } from '../integrations/discord'
import { Client } from 'discord.js'
import { TwitterApi } from 'twitter-api-v2'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TradeDiscord, TradeTelegram, TradeTwitter } from '../templates/trade'
import fromBigNumber from '../utils/fromBigNumber'
import { RandomDegen } from '../constants/degenMessage'
import { TRADE_CHANNEL } from '../constants/discordChannels'
import { GetNotableAddress } from '../utils/notableAddresses'
import { GetFren } from '../integrations/fren'
import { FN } from '../templates/common'
import { ZERO_BN } from '../constants/bn'
import { SECONDS_IN_MONTH } from '../constants/timeAgo'

export async function GetTrader(account: string, lyra: Lyra): Promise<Trader> {
  const trader = await FindOnLeaderBoard(account)
  return trader
}
