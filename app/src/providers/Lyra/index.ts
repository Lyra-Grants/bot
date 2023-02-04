import Lyra, { Market } from '@lyrafinance/lyra-js'
import { UNIT } from '../../constants/bn'
import { OptionsMap, OptionType, ProviderType } from '../../types/arbs'
import fromBigNumber from '../../utils/fromBigNumber'
import { getExpirationTerm } from '../../utils/arbUtils'

export async function getMarket(market: Market) {
  const options = market.liveBoards().map((board) => {
    const expiration = board.expiryTimestamp * 1000
    const term = getExpirationTerm(expiration)

    return board.strikes().map(async (strike) => {
      const strikePrice = fromBigNumber(strike.strikePrice)
      const quotes = await Promise.all([
        strike.quote(true, true, UNIT),
        strike.quote(true, false, UNIT),
        strike.quote(false, true, UNIT),
        strike.quote(false, false, UNIT),
      ])
      const [callBuyPrice, callSellPrice, putBuyPrice, putSellPrice] = quotes.map((quote) =>
        fromBigNumber(quote.pricePerOption),
      )

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
    })
  })

  return (await Promise.all(options?.flat()).catch(console.error))?.filter(Boolean) as OptionsMap[]
}

export async function getLyraRates(marketName: string, lyra: Lyra): Promise<OptionsMap[]> {
  const market = await lyra.market(marketName)
  const rates = await getMarket(market)
  return rates
}
