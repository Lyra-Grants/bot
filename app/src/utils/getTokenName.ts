import { LYRA_TOKENS } from '../constants/contractAddresses'

export const getTokenName = (address: string) => {
  const addr = address.toLowerCase()
  switch (addr) {
    case LYRA_TOKENS.LYRA_ETH.toLowerCase():
    case LYRA_TOKENS.LYRA_OP.toLowerCase():
    case LYRA_TOKENS.LYRA_ARB.toLowerCase():
      return 'LYRA'

    case LYRA_TOKENS.STKLYRA_ETH.toLowerCase():
    case LYRA_TOKENS.STKLYRA_OP.toLowerCase():
    case LYRA_TOKENS.STKLYRA_ARB.toLowerCase():
      return 'stkLYRA'
  }
  return ''
}
