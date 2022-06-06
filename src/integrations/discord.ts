import { TradeDto } from '../types/tradeDto'
import { DISCORD_CHANNEL_ID, TESTNET } from '../utils/secrets'
import { TradeDiscord } from '../utils/template'
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

    // const channel = client.channels.cache.get(DISCORD_CHANNEL_ID) as TextChannel
    //await channel.send({ embeds: embeds })
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
  const network = TESTNET ? 'Kovan' : 'Avalon'

  client.user?.setActivity(`${network} Trades`, { type: 'WATCHING' })
}
