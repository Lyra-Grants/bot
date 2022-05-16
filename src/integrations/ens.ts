import { mainNetInfuraProvider } from '../clients/ethersClient'

export async function GetEns(traderAddress: string): Promise<string> {
  console.log('getting ens')
  const found = global.LYRA_ENS[traderAddress]
  console.log(traderAddress)

  if (found) {
    console.log('found ' + found)
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
