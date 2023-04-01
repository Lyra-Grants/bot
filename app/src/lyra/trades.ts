import { Network } from '@lyrafinance/lyra-js'
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
} from '../config'
import { GetUrl, signed, toDate } from '../utils/utils'
import { TradeEvent } from '@lyrafinance/lyra-js'
import { FindOnLeaderBoard } from './leaderboard'
import { GetEns } from '../integrations/ens'
import { PostTelegram } from '../integrations/telegram'
import { PostDiscord } from '../discord'
import { ActionRowBuilder, ButtonBuilder, Client } from 'discord.js'
import { TwitterApi } from 'twitter-api-v2'
import { Telegraf } from 'telegraf'
import { TradeDiscord, TradeTelegram, TradeTwitter } from '../templates/trade'
import fromBigNumber from '../utils/fromBigNumber'
import { TRADE_CHANNEL } from '../constants/discordChannels'
import { GetNotableAddress } from '../utils/notableAddresses'
import { GetFren } from '../integrations/fren'
import { FN } from '../templates/common'
import getLyra from '../utils/getLyra'
import printObject from '../utils/printObject'
import formatUSD from '../utils/formatUSD'

export async function RunTradeBot(
  discordClient: Client<boolean>,
  discordClientBtc: Client<boolean>,
  twitterClient: TwitterApi,
  telegramClient: Telegraf,
  network: Network,
) {
  console.log('### Polling for Trades ###')
  const lyra = getLyra(network)

  let blockNumber: number | undefined = undefined
  let pollInterval = 60000 // 1 min

  if (TESTNET) {
    blockNumber = lyra.provider.blockNumber - 5000
    pollInterval = 20000 // 20 secs
  }

  lyra.onTrade(
    async (trade) => {
      try {
        const tradeDto = await MapToTradeDto(trade, network)
        //console.log(tradeDto)
        switch (tradeDto.market.toUpperCase()) {
          case 'SBTC-SUSD':
          case 'WBTC-USDC':
            await BroadCastTrade(tradeDto, network, twitterClient, telegramClient, discordClientBtc)
            break
          case 'SETH-SUSD':
          case 'ETH-USDC':
            await BroadCastTrade(tradeDto, network, twitterClient, telegramClient, discordClient)
            break
        }
      } catch (e: any) {
        console.log(e)
      }
    },
    { startBlockNumber: blockNumber, pollInterval: pollInterval },
  )
}

export async function MapToTradeDto(trade: TradeEvent, network: Network): Promise<TradeDto> {
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
  const asset = market.name.split('-')[0]

  const tradeDto: TradeDto = {
    account: trade.trader.toLowerCase(),
    asset: asset,
    market: market.name,
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
    leaderBoard: await FindOnLeaderBoard(trade.trader, network),
    pnl: pnl,
    pnlPercent: pnlPercent,
    totalPremiumPaid: totalPremiumPaid,
    isProfitable: pnl > 0,
    positionId: trade.positionId,
    positionTradeCount: noTrades,
    pnlFormatted: formatUSD(pnl),
    pnlPercentFormatted: `(${signed(pnlPercent)}%)`,
    isLiquidation: trade.isLiquidation,
    setCollateralTo: trade.collateralValue ? fromBigNumber(trade.collateralValue) : undefined,
    pricePerOption: fromBigNumber(trade.pricePerOption),
    lpFees: trade.liquidation ? fromBigNumber(trade.liquidation.lpFee) : undefined,
    premiumFormatted: formatUSD(
      AmountWording(fromBigNumber(trade.premium), trade.isLong, trade.isOpen, trade.isLiquidation),
    ),
    isBaseCollateral: trade.isBaseCollateral,
    baseCollateralFormatted: BaseCollateral(trade, asset),
    iv: fromBigNumber(trade.iv) * 100,
    fee: fromBigNumber(trade.fee),
    optionPrice: fromBigNumber(trade.pricePerOption),
    spot: fromBigNumber(trade.spotPrice),
    blockNumber: trade.blockNumber,
    notableAddress: from,
    isNotable: isNotable,
    unrealizedPnl: unrealizedPnl,
    unrealizedPnlPercent: unrealizedPnlPercent,
    unrealizedPnlFormatted: formatUSD(unrealizedPnl),
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
    return `${formatUSD(collateralValue)}`
  }

  return `${FN(collateralAmount, 4)} ${asset}`
}

export async function BroadCastTrade(
  trade: TradeDto,
  network: Network,
  twitterClient: TwitterApi,
  telegramClient: Telegraf,
  discordClient: Client<boolean>,
): Promise<void> {
  console.log('DISCORD THRESHOLD: ' + DISCORD_THRESHOLD)
  console.log('Trade Premium: ' + trade.premium)
  if (
    (trade.premium >= Number(TWITTER_THRESHOLD) ||
      trade.isNotable ||
      (trade?.leaderBoard?.position > 0 && trade?.leaderBoard?.position < 21)) &&
    TWITTER_ENABLED
  ) {
    await SendTweet(TradeTwitter(trade, network), twitterClient)
  }

  if (
    (trade.premium >= Number(TELEGRAM_THRESHOLD) ||
      trade.isNotable ||
      (trade?.leaderBoard?.position > 0 && trade?.leaderBoard?.position < 21)) &&
    TELEGRAM_ENABLED
  ) {
    await PostTelegram(TradeTelegram(trade, network), telegramClient)
  }

  if (
    (trade.premium >= Number(DISCORD_THRESHOLD) ||
      trade.isNotable ||
      (trade?.leaderBoard?.position > 0 && trade?.leaderBoard?.position < 21)) &&
    DISCORD_ENABLED
  ) {
    const embeds = [TradeDiscord(trade, network)]
    const rows: ActionRowBuilder<ButtonBuilder>[] = []
    await PostDiscord(embeds, rows, discordClient, TRADE_CHANNEL)
  }
}
