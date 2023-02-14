import { Network } from '@lyrafinance/lyra-js'
import dayjs from 'dayjs'
import dayjsPluginUTC from 'dayjs/plugin/utc'
import { EmbedBuilder } from 'discord.js'
import {
  ETH_LIQUIDITY_POOL,
  BTC_LIQUIDITY_POOL,
  ETH_OPTION_MARKET,
  BTC_OPTION_MARKET,
} from '../constants/contractAddresses'
import { bannerUrls, iconUrls } from '../constants/urls'
import { TradeDto, TraderAddress } from '../types/lyra'
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

export function AmountWording(isLong: boolean, isOpen: boolean, isLiquidation: boolean): string {
  if (isLiquidation) {
    return 'Amount'
  }
  const paid = 'Premium Paid'
  const received = "Premium Rec'd"

  if (isOpen) {
    return isLong ? paid : received
  }

  return isLong ? received : paid
}

export function VaultLink(market: string, network: Network) {
  return `${LyraDappUrl()}/#/vaults/${network}/${market.toLowerCase()}`
}

export function PositionLink(trade: TradeDto, network: Network): string {
  return `${LyraDappUrl()}/#/position/${network}/${trade.market.toLowerCase()}/${trade.positionId}?see=${trade.account}`
}

export function PortfolioLink(account: string) {
  return `${LyraDappUrl()}/#/portfolio?see=${account}`
}

export function TwitterLink(handle: string) {
  return `https://twitter.com/${handle}`
}

export function NetworkFooter(embed: EmbedBuilder, network: Network) {
  embed
    .setFooter({
      iconURL: `${network === Network.Optimism ? iconUrls.optimism : iconUrls.arbitrum}`,
      text: `${network === Network.Optimism ? 'Optimism' : 'Arbitrum'}`,
    })
    .setTimestamp()
    .setImage(network === Network.Optimism ? bannerUrls.optimism : bannerUrls.arbitrum)
}

export function ExpiryLink(market: string, network: Network, date: string) {
  return `${LyraDappUrl()}/#/trade/${network}/${market.toLowerCase()}?expiry=${date}`
}

export function TradeHistoryLink(trade: TraderAddress) {
  return `${LyraDappUrl()}/#/portfolio/history?see=${trade.account}`
}

export function EtherScanTransactionLink(transactionHash: string) {
  return `${EtherScanUrl()}/tx/${transactionHash}`
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

export function EtherScanUrl() {
  return 'https://optimistic.etherscan.io'
}

export function LyraDappUrl() {
  return 'https://app.lyra.finance'
}

export function TradeShareImage(trade: TradeDto) {
  return `${LyraDappUrl()}/position/image/${trade.asset}/${trade.positionId}`
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

export function GetMarket(address: string) {
  let market = ''
  if (address.toLowerCase() == ETH_LIQUIDITY_POOL || address.toLowerCase() == ETH_OPTION_MARKET) {
    market = 'ETH'
  }
  if (address.toLowerCase() == BTC_LIQUIDITY_POOL || address.toLowerCase() == BTC_OPTION_MARKET) {
    market = 'BTC'
  }
  return market
}

export function DisplayTrader(trade: TraderAddress, useShortAddress = false) {
  if (trade.isNotable) {
    return trade.notableAddress
  }
  if (trade.ens) {
    return `👨‍ ${trade.ens}`
  }
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
