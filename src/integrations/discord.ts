import { TradeDto } from '../types/lyra'
import { ActivityType, Client, EmbedBuilder, TextChannel } from 'discord.js'
import dayjs from 'dayjs'
import { FN } from '../templates/common'
import printObject from '../utils/printObject'
import { TESTNET } from '../secrets'

export async function PostDiscord(embed: EmbedBuilder[], client: Client<boolean>, channelName: string) {
  if (TESTNET) {
    printObject(embed)
  } else {
    try {
      const channels = client.channels.cache
        .filter((value) => (value as TextChannel)?.name == channelName)
        .map(async (channel) => {
          console.log(`found channel: ${channelName}`)
          await (channel as TextChannel).send({ embeds: embed })
        })
    } catch (e: any) {
      console.log(e)
    }
  }
}

export function activityString(trade: TradeDto) {
  return `${trade.asset} ${dayjs(trade.expiry).format('DD MMM')} ${trade.isLong ? 'Long' : 'Short'} ${
    trade.isCall ? 'C' : 'P'
  } $${trade.strike} x ${trade.size} $${trade.premium}`
}

export function defaultActivity(client: Client<boolean>, isBtc = false) {
  try {
    if (!isBtc) {
      client.user?.setActivity(`24h: ${FN(global.ETH_24HR, 2)}%`, { type: ActivityType.Watching })
    } else {
      client.user?.setActivity(`24h: ${FN(global.BTC_24HR, 2)}%`, { type: ActivityType.Watching })
    }
  } catch (e: any) {
    console.log(e)
  }
}

export async function defaultName(client: Client<boolean>, isBtc = false) {
  try {
    if (!isBtc) {
      await client.user?.setUsername(`ETH - $${FN(global.ETH_PRICE, 2)}`)
    } else {
      await client.user?.setUsername(`BTC - $${FN(global.BTC_PRICE, 2)}`)
    }
  } catch (e: any) {
    console.log(e)
  }
}
