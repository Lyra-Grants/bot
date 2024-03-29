import { vaultIntegrations } from '../constants/addresses'
import { urls } from '../constants/urls'

export function Timestamp(): number {
  return Math.floor(Date.now() / 1000)
}

export const toDate = (value: number): Date => {
  return new Date(value * 1000)
}

export function convertToBoolean(input: string): boolean | undefined {
  try {
    return JSON.parse(input.toLowerCase())
  } catch (e) {
    return undefined
  }
}

export function shortAddress(value: string): string {
  return `${value.slice(0, 5)}...${value.slice(-4)}`
}

export function signed(value: number): string {
  const nonNeg = value > 0 ? value : value * -1
  return `${value > 0 ? '+' : '-'}${nonNeg.toFixed(2)}`
}

export function firstAddress(value: string): string {
  return `${value.slice(0, 5)}`
}

export const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce((groups, item) => {
    ;(groups[key(item)] ||= []).push(item)
    return groups
  }, {} as Record<K, T[]>)

export function GetUrl(account: string, isNotable: boolean) {
  if (isNotable) {
    switch (account) {
      case vaultIntegrations.POLY_ETH_CALL:
        return `${urls.polynomialDappUrl}/products/eth-call-selling`
      case vaultIntegrations.POLY_ETH_PUT:
        return `${urls.polynomialDappUrl}/products/eth-put-selling`
      case vaultIntegrations.POLY_ETH_QUOTE:
        return `${urls.polynomialDappUrl}/products/eth-call-selling-quote`
      case vaultIntegrations.BRAHMA_MOONSHOTS:
        return `${urls.brahmaDappUrl}/vault/pmusdc`
      case vaultIntegrations.BRAHMA_ETHMAXI:
        return `${urls.brahmaDappUrl}/vault/ethmaxi`
      case vaultIntegrations.TOROS_ETHCALL:
      case vaultIntegrations.TOROS_ETHLONGVOL:
        return `${urls.dHedgeDappUrl}/pool/${account}`
    }
  }
  return ''
}

export function titleCaseWord(word: string) {
  if (!word) return word
  return (word = word[0].toUpperCase() + word.slice(1))
}
