import dayjs from 'dayjs'
import dayjsPluginUTC from 'dayjs/plugin/utc'
import {
  ETH_LIQUIDITY_POOL,
  BTC_LIQUIDITY_POOL,
  ETH_OPTION_MARKET,
  BTC_OPTION_MARKET,
} from '../constants/contractAddresses'
import { TradeDto, TraderAddress } from '../types/lyra'
import { shortAddress } from '../utils/utils'

export const zapperUrl = 'https://zapper.fi/account/'
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

export function VaultLink(asset: string) {
  return `${LyraDappUrl()}/vaults/${asset.toLowerCase()}`
}

export function PositionLink(trade: TradeDto): string {
  return `${LyraDappUrl()}/position?market=${trade.asset}&id=${trade.positionId}&see=${trade.account}`
}

export function PortfolioLink(account: string) {
  return `${LyraDappUrl()}/portfolio?see=${account}`
}

export function TwitterLink(handle: string) {
  return `https://twitter.com/${handle}`
}

export function ExpiryLink(asset: string, date: string) {
  return `${LyraDappUrl()}/trade/${asset.toLowerCase()}?expiry=${date}`
}

export function TradeHistoryLink(trade: TraderAddress) {
  return `${LyraDappUrl()}/portfolio/history?see=${trade.account}`
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
