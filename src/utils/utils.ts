export function Timestamp(): number {
  return Math.floor(Date.now() / 1000)
}

export const toNumber = (value: any): number => {
  return value / 1000000000000000000
}

export const toDate = (value: number): Date => {
  return new Date(value * 1000)
}

export const toWholeNumber = (value: any): number => {
  return Math.floor(value / 1000000000000000000)
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
