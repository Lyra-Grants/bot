import { TradeDto } from '../types/tradeDto'
import { TESTNET } from '../secrets'
import { Client, MessageEmbed, TextChannel } from 'discord.js/typings/index.js'
import dayjs from 'dayjs'

export async function PostDiscord(embeds: MessageEmbed[], client: Client<boolean>, channelName: string) {
  try {
    const channels = client.channels.cache
      .filter((value) => (value as TextChannel)?.name == channelName)
      .map(async (channel) => {
        console.log(`found channel: ${channelName}`)
        await (channel as TextChannel).send({ embeds: embeds })
      })
  } catch (e: any) {
    console.log(e)
  }
}

export function activityString(trade: TradeDto) {
  return `${trade.asset} ${dayjs(trade.expiry).format('DD MMM')} ${trade.isLong ? 'Long' : 'Short'} ${
    trade.isCall ? 'C' : 'P'
  } $${trade.strike} x ${trade.size} $${trade.premium}`
}

export async function defaultActivity(client: Client<boolean>) {
  try {
    client.user?.setActivity(`24h: ${global.ETH_24HR.toFixed(2)}%`, { type: 'WATCHING' })
  } catch (e: any) {
    console.log(e)
  }
}

export async function defaultName(client: Client<boolean>) {
  try {
    await client.user?.setUsername(`ETH - $${global.ETH_PRICE.toFixed(2)}`)
  } catch (e: any) {
    console.log(e)
  }
}
