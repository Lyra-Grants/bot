import dayjs from 'dayjs'
import dayjsPluginUTC from 'dayjs/plugin/utc'
import { EmbedBuilder } from 'discord.js'
import {
  ETH_LIQUIDITY_POOL_ARB,
  ETH_LIQUIDITY_POOL_OP,
  ETH_OPTION_MARKET_OP,
  BTC_LIQUIDITY_POOL_OP,
  BTC_OPTION_MARKET_OP,
  BTC_LIQUIDITY_POOL_ARB,
  ETH_OPTION_MARKET_ARB,
  BTC_OPTION_MARKET_ARB,
  ARB_LIQUIDITY_POOL_OP,
  ARB_OPTION_MARKET_OP,
  OP_LIQUIDITY_POOL_OP,
  OP_OPTION_MARKET_OP,
} from '../constants/contractAddresses'
import { AssetType, bannerUrls, iconUrls, thumbUrls } from '../constants/urls'
import { TradeDto, TraderAddress } from '../types/trade'
import { shortAddress } from '../utils/utils'

export const zapperUrl = 'https://zapper.xyz/account/'
export const debankUrl = 'https://debank.com/profile/'

export function ShowProfitAndLoss(positionTradeCount: number, pnl: number): boolean {
  return positionTradeCount > 1 && pnl != 0
}

export function Medal(position: number): string {
  if (position == 1) {
    return '🥇'
  }
  if (position == 2) {
    return '🥈'
  }
  if (position == 3) {
    return '🥉'
  }
  return '🏅'
}

export function AmountWording(isLong: boolean, isOpen: boolean): string {
  const paid = 'Premium Paid'
  const received = "Premium Rec'd"

  if (isOpen) {
    return isLong ? paid : received
  }

  return isLong ? received : paid
}

// export function PositionLink(trade: TradeDto, network: Network): string {
//   return `${LyraDappUrl()}/#/position/${network}/${trade.market.toLowerCase()}/${trade.positionId}?see=${trade.account}`
// }

export function PortfolioLink(account: string) {
  return `${LyraDappUrl()}/#/portfolio?see=${account}`
}

export function TwitterLink(handle: string) {
  return `https://twitter.com/${handle}`
}

export function Footer(embed: EmbedBuilder) {
  embed
    .setFooter({
      iconURL: `${iconUrls.lyra}`,
      text: `Lyra`,
    })
    .setTimestamp()
    .setImage(`${bannerUrls.lyra}`)
}

export function getThumb(market: string): string | undefined {
  const marketType = market as any as AssetType

  // Check if the passed market exists within our thumbUrls constant
  // eslint-disable-next-line no-prototype-builtins
  if (thumbUrls.hasOwnProperty(marketType)) {
    return thumbUrls[marketType]
  }

  // If no match is found, return null
  return undefined
}

export function TradeHistoryLink(trade: TraderAddress) {
  return `${LyraDappUrl()}/#/portfolio/history?see=${trade.account}`
}

export function TransactionLink(transactionHash: string) {
  return `https://explorer.lyra.finance/tx/${transactionHash}`
}

export function TraderLink(account: string) {
  return `https://explorer.lyra.finance/address/${account}`
}

export function FormattedDate(date: Date) {
  dayjs.extend(dayjsPluginUTC)
  return dayjs(date).utc().format('DD MMM YY')
}

export function FormattedDateShort(date: Date) {
  dayjs.extend(dayjsPluginUTC)
  return dayjs(date).utc().format('DDMMMYY').toUpperCase()
}

export function FormattedDateTime(date: Date) {
  dayjs.extend(dayjsPluginUTC)
  return dayjs(date).utc().format('MMM-DD-YY HH:mm:ss') + ' UTC'
}

export const LyraDappUrl = () => {
  return 'https://app.lyra.finance'
}

export function FN(value: number, decimals: number) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

// formatted number signed
export function FNS(value: number, decimals: number) {
  const sign = value > 0 ? '+' : ''

  return `${sign}${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

//todo add these to a config per asset
export function GetAsset(address: string) {
  const asset = ''

  switch (address.toLowerCase()) {
    case ETH_LIQUIDITY_POOL_ARB.toLowerCase():
    case ETH_LIQUIDITY_POOL_OP.toLowerCase():
    case ETH_OPTION_MARKET_OP.toLowerCase():
    case ETH_OPTION_MARKET_ARB.toLowerCase():
      return 'ETH'
    case BTC_LIQUIDITY_POOL_OP.toLowerCase():
    case BTC_LIQUIDITY_POOL_ARB.toLowerCase():
    case BTC_OPTION_MARKET_OP.toLowerCase():
    case BTC_OPTION_MARKET_ARB.toLowerCase():
      return 'BTC'
    case OP_LIQUIDITY_POOL_OP.toLowerCase():
    case OP_OPTION_MARKET_OP.toLowerCase():
      return 'OP'
    case ARB_LIQUIDITY_POOL_OP.toLowerCase():
    case ARB_OPTION_MARKET_OP.toLowerCase():
      return 'ARB'
  }
  return asset
}

export function GetMarket(address: string) {
  const market = ''

  switch (address.toLowerCase()) {
    case ETH_LIQUIDITY_POOL_ARB.toLowerCase():
    case ETH_OPTION_MARKET_ARB.toLowerCase():
    case ETH_LIQUIDITY_POOL_OP.toLowerCase():
    case ETH_OPTION_MARKET_OP.toLowerCase():
      return 'ETH-USDC'
    case BTC_LIQUIDITY_POOL_OP.toLowerCase():
    case BTC_LIQUIDITY_POOL_ARB.toLowerCase():
    case BTC_OPTION_MARKET_OP.toLowerCase():
    case BTC_OPTION_MARKET_ARB.toLowerCase():
      return 'WBTC-USDC'
    case OP_LIQUIDITY_POOL_OP.toLowerCase():
    case OP_OPTION_MARKET_OP.toLowerCase():
      return 'OP-USDC'
    case ARB_LIQUIDITY_POOL_OP.toLowerCase():
    case ARB_OPTION_MARKET_OP.toLowerCase():
      return 'ARB-USDC'
  }
  return market
}

export function DisplayTrader(trade: TradeDto, useShortAddress = false) {
  // if (trade.isNotable) {
  //   return trade.notableAddress
  // }
  // if (trade.ens) {
  //   return `👨‍ ${trade.ens}`
  // }
  if (useShortAddress) {
    return `👨‍ ${shortAddress(trade.account)}`
  }

  return `👨‍ ${trade.account}`
}

export function DisplayTraderNoEmoji(trade: TraderAddress) {
  if (trade.isNotable) {
    return trade.notableAddress
  }
  if (trade.ens) {
    return `${trade.ens}`
  }

  return `${trade.account}`
}

export function MarketColor() {
  return '#1AF7C0'
  const marketName = ''
  if (
    marketName.toLowerCase() == 'eth' ||
    marketName.toLowerCase() == 'seth-susd' ||
    marketName.toLowerCase() == 'eth-usdc'
  ) {
    return '#627EEA'
  }
  if (
    marketName.toLowerCase() == 'btc' ||
    marketName.toLowerCase() == 'sbtc-susd' ||
    marketName.toLowerCase() == 'wbtc-usdc'
  ) {
    return '#F7931A'
  }
  if (marketName.toLowerCase() == 'arb' || marketName.toLowerCase() == 'arb-usdc') {
    return '#28A0F0'
  }
  if (marketName.toLowerCase() == 'op' || marketName.toLowerCase() == 'op-usdc') {
    return '#FF0420'
  }
}
