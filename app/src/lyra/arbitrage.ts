import { Deal, OptionType, ProviderType } from '../types/arbs'
//import { useRatesData } from '../utils/arbUtils'
import { maxBy, minBy } from 'lodash'
import moment from 'moment'
import { EventType } from '../constants/eventType'
import { GetPrice } from '../integrations/prices'

// export async function GetArbitrageDeals(market: string, network: string) {
//   const price = GetPrice(market)
//   const deals = await useDeals(market, network)

//   const data = deals.map((deal) => {
//     const momentExp = moment(deal?.expiration)
//     const duration = moment.duration(momentExp.diff(moment())).asYears()
//     const arb: Arb = {
//       ...deal,
//       apy: (deal.amount / price / duration) * 100,
//       discount: (deal.amount / (deal.sell?.bidPrice as number)) * 100,
//     }
//     return arb
//   })

//   data.sort((a, b) => b.apy - a.apy)

//   const event: ArbDto = {
//     arbs: data,
//     eventType: EventType.Arb,
//     market: market,
//   }

//   return event
// }

// export async function useDeals(marketName: string, network: string) {
//   const { allRates } = await useRatesData(marketName, network)
//   const res: Deal[] = []
//   const providers = [ProviderType.LYRA, ProviderType.DERIBIT]
//   const profit_threshold = 3

//   Object.values(allRates).forEach((strike) =>
//     Object.values(strike).forEach((interception) => {
//       const providerFiltered = providers
//         ? interception.filter((option) => option && providers.includes(option.provider))
//         : interception
//       if (providerFiltered?.length < 2) return

//       const maxCall = maxBy(providerFiltered, (o) => o[OptionType.CALL]?.bidPrice)?.CALL
//       const minCall = minBy(providerFiltered, (o) => o[OptionType.CALL]?.askPrice)?.CALL
//       const maxPut = maxBy(providerFiltered, (o) => o[OptionType.PUT]?.bidPrice)?.PUT
//       const minPut = minBy(providerFiltered, (o) => o[OptionType.PUT]?.askPrice)?.PUT
//       const callDeal =
//         maxCall?.bidPrice &&
//         minCall?.askPrice &&
//         maxCall.provider !== minCall.provider &&
//         maxCall.bidPrice - minCall.askPrice
//       const putDeal =
//         maxPut?.bidPrice && minPut?.askPrice && maxPut.provider !== minPut.provider && maxPut.bidPrice - minPut.askPrice

//       if (callDeal && callDeal > profit_threshold) {
//         res.push({
//           type: OptionType.CALL,
//           term: maxCall.term,
//           strike: maxCall.strike,
//           expiration: maxCall.expiration,
//           amount: callDeal,
//           buy: minCall,
//           sell: maxCall,
//         })
//       }
//       if (putDeal && putDeal > profit_threshold) {
//         res.push({
//           type: OptionType.PUT,
//           term: maxPut.term,
//           strike: maxPut.strike,
//           expiration: maxPut.expiration,
//           amount: putDeal,
//           buy: minPut,
//           sell: maxPut,
//         })
//       }
//     }),
//   )

//   return res
// }
