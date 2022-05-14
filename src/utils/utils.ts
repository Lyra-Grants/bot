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
