import Lyra from '@lyrafinance/lyra-js'
import { SendTweet } from '../integrations/twitter'
import { TradeDto } from '../types/lyra'
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
import { TradeDiscord, TradeTelegram, TradeTwitter } from '../templates/trade'
import fromBigNumber from '../utils/fromBigNumber'
import { RandomDegen } from '../constants/degenMessage'
import { TRADE_CHANNEL } from '../constants/discordChannels'
import { GetNotableAddress } from '../utils/notableAddresses'
import { GetFren } from '../integrations/fren'
import { FN } from '../templates/common'

export async function RunTradeBot(
  discordClient: Client<boolean>,
  discordClientBtc: Client<boolean>,
  twitterClient: TwitterApi,
  telegramClient: Telegraf,
  lyraClient: Lyra,
) {
  console.log('### Polling for Trades ###')

  let blockNumber: number | undefined = undefined
  let pollInterval = 60000
  if (TESTNET) {
    blockNumber = lyraClient.provider.blockNumber - 5000
    pollInterval = 6000
  }

  lyraClient.onTrade(
    async (trade) => {
      try {
        const tradeDto = await MapToTradeDto(trade)
        console.log(tradeDto)
        switch (tradeDto.asset) {
          case 'sBtc-sUSD':
            await BroadCastTrade(tradeDto, twitterClient, telegramClient, discordClientBtc)
            break
          case 'sETH-sUSD':
            await BroadCastTrade(tradeDto, twitterClient, telegramClient, discordClient)
            break
        }
      } catch (e: any) {
        console.log(e)
      }
    },
    { startBlockNumber: blockNumber, pollInterval: pollInterval },
  )
}

export async function MapToTradeDto(trade: TradeEvent): Promise<TradeDto> {
  const position = await trade.position()
  //const tradePnl = fromBigNumber(trade.pnl(position))
  const positionPnl = position.pnl()
  const unrealizedPnl = fromBigNumber(positionPnl.unrealizedPnl)
  const unrealizedPnlPercent = fromBigNumber(positionPnl.unrealizedPnlPercentage)
  const pnl = fromBigNumber(positionPnl.realizedPnl)
  const pnlPercent = fromBigNumber(positionPnl.realizedPnlPercentage)

  const trades = position.trades()
  const totalPremiumPaid = fromBigNumber(trade.premium)
  const market = await trade.market()
  const noTrades = trades.length
  const from = GetNotableAddress(trade.trader)
  const ens = await GetEns(trade.trader)
  const isNotable = from != ''

  const tradeDto: TradeDto = {
    account: trade.trader.toLowerCase(),
    asset: market.name,
    isLong: trade.isLong,
    isCall: trade.isCall,
    isBuy: trade.isBuy,
    strike: fromBigNumber(trade.strikePrice),
    expiry: toDate(trade.expiryTimestamp),
    size: fromBigNumber(trade.size),
    premium: fromBigNumber(trade.premium),
    transactionHash: trade.transactionHash,
    isOpen: trade.isOpen,
    ens: ens,
    leaderBoard: await FindOnLeaderBoard(trade.trader),
    pnl: pnl,
    pnlPercent: pnlPercent,
    totalPremiumPaid: totalPremiumPaid,
    isProfitable: pnl > 0,
    positionId: trade.positionId,
    positionTradeCount: noTrades,
    pnlFormatted: dollar(pnl),
    pnlPercentFormatted: `(${signed(pnlPercent)}%)`,
    isLiquidation: trade.isLiquidation,
    setCollateralTo: trade.collateralValue ? fromBigNumber(trade.collateralValue) : undefined,
    pricePerOption: fromBigNumber(trade.pricePerOption),
    lpFees: trade.liquidation ? fromBigNumber(trade.liquidation.lpFee) : undefined,
    premiumFormatted: dollar(
      AmountWording(fromBigNumber(trade.premium), trade.isLong, trade.isOpen, trade.isLiquidation),
    ),
    isBaseCollateral: trade.isBaseCollateral,
    baseCollateralFormatted: BaseCollateral(trade, market.name),
    iv: fromBigNumber(trade.iv) * 100,
    fee: fromBigNumber(trade.fee),
    optionPrice: fromBigNumber(trade.pricePerOption),
    spot: fromBigNumber(trade.spotPrice),
    blockNumber: trade.blockNumber,
    notableAddress: from,
    isNotable: isNotable,
    unrealizedPnl: unrealizedPnl,
    unrealizedPnlPercent: unrealizedPnlPercent,
    unrealizedPnlFormatted: dollar(unrealizedPnl),
    unrealizedPnlPercentFormatted: `(${signed(pnlPercent)}%)`,
    fren: await GetFren(ens),
    url: GetUrl(trade.trader.toLowerCase(), isNotable),
  }
  return tradeDto
}

export function AmountWording(amount: number, isLong: boolean, isOpen: boolean, isLiquidation: boolean): number {
  if (isLiquidation) {
    return amount * -1
  }

  if (isOpen) {
    return isLong ? amount * -1 : amount
  }

  return isLong ? amount : amount * -1
}

export function BaseCollateral(trade: TradeEvent, asset: string) {
  const collateralValue = trade.collateralValue ? fromBigNumber(trade.collateralValue) : undefined
  const collateralAmount = trade.collateralAmount ? fromBigNumber(trade.collateralAmount) : undefined

  if (collateralAmount == undefined) {
    return ''
  }

  if (!trade.isBaseCollateral && collateralValue) {
    return `$${FN(collateralValue, 2)}`
  }

  return `${FN(collateralAmount, 4)} ${asset}`
}

export async function BroadCastTrade(
  trade: TradeDto,
  twitterClient: TwitterApi,
  telegramClient: Telegraf,
  discordClient: Client<boolean>,
): Promise<void> {
  console.log('DISCORD THRESHOLD: ' + DISCORD_THRESHOLD)
  console.log('Trade Premium: ' + trade.premium)
  if (
    (trade.premium >= TWITTER_THRESHOLD ||
      trade.isNotable ||
      (trade?.leaderBoard?.position > 0 && trade?.leaderBoard?.position < 21)) &&
    TWITTER_ENABLED
  ) {
    await SendTweet(TradeTwitter(trade), twitterClient)
  }

  if (
    (trade.premium >= TELEGRAM_THRESHOLD ||
      trade.isNotable ||
      (trade?.leaderBoard?.position > 0 && trade?.leaderBoard?.position < 21)) &&
    TELEGRAM_ENABLED
  ) {
    await PostTelegram(TradeTelegram(trade), telegramClient)
  }

  if (
    (trade.premium >= DISCORD_THRESHOLD ||
      trade.isNotable ||
      (trade?.leaderBoard?.position > 0 && trade?.leaderBoard?.position < 21)) &&
    DISCORD_ENABLED
  ) {
    await PostDiscord([TradeDiscord(trade)], discordClient, TRADE_CHANNEL)
  }
}
