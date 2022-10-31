import { mainNetInfuraProvider } from '../clients/ethersClient'

export async function GetEns(account: string | undefined): Promise<string> {
  if (account == undefined) {
    return ''
  }
  console.debug(`Getting ens for ${account}`)
  const found = global.LYRA_ENS[account.toLowerCase()]

  if (found || found === '') {
    console.debug('found ' + found)
    return found
  }

  const ens = await mainNetInfuraProvider.lookupAddress(account)

  if (ens) {
    global.LYRA_ENS[account] = ens
  } else {
    global.LYRA_ENS[account] = ''
  }

  return ens ? ens : ''
}

export async function ResolveEns(ens: string | undefined): Promise<string> {
  if (ens == undefined || ens == '') {
    return ''
  }

  console.debug(`Getting account for ${ens}`)

  const account = await mainNetInfuraProvider.resolveName(ens.toLowerCase())

  if (account) {
    console.log(`Address found for ENS ${ens}: ${account}`)
    return account
  }

  return ''
}
