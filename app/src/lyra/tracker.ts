import { TOKEN_THRESHOLD } from '../config'
import fromBigNumber from '../utils/fromBigNumber'
import { ActionRowBuilder, ButtonBuilder, Client } from 'discord.js'
import { TransferDto } from '../types/trade'
import { PostDiscord } from '../discord'
import { GetEns } from '../integrations/ens'
import { GetNotableAddress } from '../utils/notableAddresses'
import { SendTweet } from '../integrations/twitter'
//import { ERC20__factory } from '@lyrafinance/lyra-js'
import { Event as GenericEvent } from 'ethers'
import { TwitterApi } from 'twitter-api-v2'
import { TOKEN_CHANNEL } from '../constants/discordChannels'
//import { TransferEvent } from '@lyrafinance/lyra-js/src/contracts/common/typechain/ERC20''
import { getTokenName } from '../utils/getTokenName'
import { GetPrice } from '../integrations/prices'

// exclude g-uni
// const excludeAddresses = ['0x70535c46ce04181adf749f34b65b6365164d6b6e']

// export async function TrackTransfer(
//   discordClient: Client,
//   twitterClient: TwitterApi,
//   genericEvent: GenericEvent,
//   network: string,
// ): Promise<void> {
//   const event = parseEvent(genericEvent as TransferEvent)
//   const amount = fromBigNumber(event.args.value)
//   const price = GetPrice('lyra')
//   const value = price * amount

//   console.log(`Transfer Value: ${value}`)

//   if (
//     value >= Number(TOKEN_THRESHOLD) &&
//     !excludeAddresses.includes(event.args.to.toLowerCase()) &&
//     !excludeAddresses.includes(event.args.from.toLowerCase())
//   ) {
//     try {
//       const from = GetNotableAddress(event.args.from)
//       const to = GetNotableAddress(event.args.to)
//       const fromEns = await GetEns(event.args.from)
//       const toEns = await GetEns(event.args.to)

//       const transferDto: TransferDto = {
//         from: from === '' ? event.args.from : from,
//         to: to === '' ? event.args.to : to,
//         amount: amount,
//         transactionHash: event.transactionHash,
//         fromEns: fromEns,
//         toEns: toEns,
//         value: value,
//         notableTo: to !== '',
//         notableFrom: from !== '',
//         fromAddress: event.args.from,
//         toAddress: event.args.to,
//         token: getTokenName(event.address),
//       }
//       BroadCastTransfer(transferDto, discordClient, twitterClient, network)
//     } catch (ex) {
//       console.log(ex)
//     }
//   } else {
//     console.log(`Transfer less than $${TOKEN_THRESHOLD} threshold value`)
//   }
// }

// export async function BroadCastTransfer(
//   transferDto: TransferDto,
//   discordClient: Client<boolean>,
//   twitterClient: TwitterApi,
//   network: Network,
// ): Promise<void> {
//   const post = TransferDiscord(transferDto, network)
//   const rows: ActionRowBuilder<ButtonBuilder>[] = []
//   await PostDiscord(post, rows, discordClient, TOKEN_CHANNEL)

//   const twitter = TransferTwitter(transferDto, network)
//   await SendTweet(twitter, twitterClient)
// }

// export function parseEvent(event: TransferEvent): TransferEvent {
//   const parsedEvent = ERC20__factory.createInterface().parseLog(event)

//   if ((parsedEvent.args as TransferEvent['args']).length > 0) {
//     event.args = parsedEvent.args as TransferEvent['args']
//   }
//   return event
// }
