import { Network } from '@lyrafinance/lyra-js'
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

export function BlockExplorerLink(transactionHash: string, network: Network, mainnet = false) {
  if (mainnet) {
    return `https://etherscan.io/tx/${transactionHash}`
  }

  if (network == Network.Arbitrum) {
    return `https://arbiscan.io/tx/${transactionHash}`
  }

  return `https://optimistic.etherscan.io/tx/${transactionHash}`
}

export function BlockExplorerAddress(address: string, network: Network, mainnet = false) {
  if (mainnet) {
    return `https://etherscan.io/address/${address}`
  }

  if (network == Network.Arbitrum) {
    return `https://arbiscan.io/address/${address}`
  }

  return `https://optimistic.etherscan.io/address/${address}`
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

export function GetAsset(address: string) {
  const asset = ''

  switch (address.toLowerCase()) {
    case ETH_LIQUIDITY_POOL_ARB.toLowerCase():
    case ETH_LIQUIDITY_POOL_OP.toLowerCase():
    case ETH_OPTION_MARKET_OP.toLowerCase():
      return 'ETH'
    case BTC_LIQUIDITY_POOL_OP.toLowerCase():
    case BTC_OPTION_MARKET_OP.toLowerCase():
    case BTC_LIQUIDITY_POOL_ARB.toLowerCase():
      return 'BTC'
  }
  return asset
}

export function GetMarket(address: string) {
  const market = ''

  switch (address.toLowerCase()) {
    case ETH_LIQUIDITY_POOL_ARB.toLowerCase():
      return 'ETH-USDC'
    case ETH_LIQUIDITY_POOL_OP.toLowerCase():
    case ETH_OPTION_MARKET_OP.toLowerCase():
      return 'sETH-sUSD'
    case BTC_LIQUIDITY_POOL_OP.toLowerCase():
    case BTC_OPTION_MARKET_OP.toLowerCase():
      return 'sBTC-sUSD'
    case BTC_LIQUIDITY_POOL_ARB.toLowerCase():
      return 'WBTC-USDC'
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

export function MarketColor(marketName: string) {
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

  return '#1AF7C0'
}

export function StatSymbol(marketName: string) {
  if (
    marketName.toLowerCase() == 'eth' ||
    marketName.toLowerCase() == 'seth-susd' ||
    marketName.toLowerCase() == 'eth-usdc'
  ) {
    return '🔷'
  }
  if (
    marketName.toLowerCase() == 'btc' ||
    marketName.toLowerCase() == 'sbtc-susd' ||
    marketName.toLowerCase() == 'wbtc-usdc'
  ) {
    return '🔶'
  }
}
