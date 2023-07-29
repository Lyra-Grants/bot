import { Network, Market } from '@lyrafinance/lyra-js'
import { UNIT } from '../../constants/bn'
import { OptionsMap, OptionType, ProviderType } from '../../types/arbs'
import fromBigNumber from '../../utils/fromBigNumber'
import { getExpirationTerm } from '../../utils/arbUtils'
import getLyraSDK from '../../utils/getLyraSDK'
import filterNulls from '../../utils/filterNulls'

export async function getMarket(market: Market) {
  const options = market.liveBoards().map((board) => {
    const expiration = board.expiryTimestamp * 1000
    const term = getExpirationTerm(expiration)

    return board.strikes().map(async (strike) => {
      try {
        if (!strike.isDeltaInRange) {
          return
        }
        const strikePrice = fromBigNumber(strike.strikePrice)
        const allQuotes = await strike.quoteAll(UNIT)
        const callBuyPrice = fromBigNumber(allQuotes.callAsk.pricePerOption)
        const callSellPrice = fromBigNumber(allQuotes.callBid.pricePerOption)
        const putBuyPrice = fromBigNumber(allQuotes.putAsk.pricePerOption)
        const putSellPrice = fromBigNumber(allQuotes.putBid.pricePerOption)

        if ([callBuyPrice, callSellPrice, putBuyPrice, putSellPrice].every((val) => !val)) {
          return
        }

        const instrumentMeta = {
          strike: strikePrice,
          term,
          expiration,
          provider: ProviderType.LYRA,
        }

        return {
          ...instrumentMeta,
          [OptionType.CALL]: {
            ...instrumentMeta,
            type: OptionType.CALL,
            askPrice: callBuyPrice,
            bidPrice: callSellPrice,
            midPrice: (callBuyPrice + callSellPrice) / 2,
          },
          [OptionType.PUT]: {
            ...instrumentMeta,
            type: OptionType.PUT,
            askPrice: putBuyPrice,
            bidPrice: putSellPrice,
            midPrice: (putBuyPrice + putSellPrice) / 2,
          },
        }
      } catch (error) {
        console.log(error)
        return
      }
    })
  })

  const flatOptions = options?.flat()
  const optionsFound = await Promise.all(flatOptions)
  const result = filterNulls(optionsFound) as OptionsMap[]
  return result
}

export async function getLyraRates(marketName: string, network: Network): Promise<OptionsMap[]> {
  console.log(`Getting market ${marketName}`)
  const lyra = getLyraSDK(network)
  const market = await lyra.market(marketName)
  const rates = await getMarket(market)
  return rates
}
