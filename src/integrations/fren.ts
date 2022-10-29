import axios from 'axios'
import { urls } from '../constants/urls'
import { FrenData } from '../types/fren'

export const GetFren = async (search: string) => {
  const found = global.FREN[search.toLowerCase()]

  if (found || found === '') {
    console.debug('fren found ' + found)
    return found
  }

  const searchUrl = `${urls.etherleaderboardApiUrl}?q=${search.toLowerCase()}`
  console.log(searchUrl)
  const frenData = (await axios.get(`${urls.etherleaderboardApiUrl}?q=${search}`)).data as FrenData
  console.log(frenData)
  if (frenData.frens.length >= 1) {
    global.FREN[search.toLowerCase()] = frenData.frens[0]
    console.log(frenData.frens[0])

    return frenData.frens[0]
  } else {
    const EMPTY = {
      id: '',
      name: '',
      ens: '',
      handle: '',
      followers: -1,
      verified: false,
      updated: new Date(),
      pfp: '',
      ranking: -1,
    }
    global.FREN[search.toLowerCase()] = EMPTY
    return EMPTY
  }
}
