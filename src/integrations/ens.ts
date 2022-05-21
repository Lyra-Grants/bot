import { mainNetInfuraProvider } from '../clients/ethersClient'

export async function GetEns(traderAddress: string | undefined): Promise<string> {
  if (traderAddress == undefined) {
    return ''
  }
  console.debug(`Getting ens for ${traderAddress}`)
  const found = global.LYRA_ENS[traderAddress.toLowerCase()]

  if (found || found === '') {
    console.debug('found ' + found)
    return found
  }

  const ens = await mainNetInfuraProvider.lookupAddress(traderAddress)

  if (ens) {
    global.LYRA_ENS[traderAddress] = ens
  } else {
    global.LYRA_ENS[traderAddress] = ''
  }

  return ens ? ens : ''
}
