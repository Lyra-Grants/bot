import axios from 'axios'
import { urls } from '../constants/urls'
import { FrenData } from '../types/fren'

export const GetFren = async (search: string) => {
  return undefined

  const found = global.FREN[search.toLowerCase()]

  // if (found || found === '') {
  //   console.debug('fren found ' + found)
  //   return found
  // }

  // const frenData = (await axios.get(`${urls.etherleaderboardApiUrl}?q=${search}`)).data as FrenData

  // if (frenData.count >= 1) {
  //   global.FREN[search] = frenData.frens[0]

  //   return frenData.frens[0]
  // }

  // return undefined
}
