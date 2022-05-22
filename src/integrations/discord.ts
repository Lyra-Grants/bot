import { TradeDto } from '../types/tradeDto'
import { DISCORD_CHANNEL_ID, TESTNET } from '../utils/secrets'
import { TradeDiscord } from '../utils/template'
import { Client, MessageEmbed, TextChannel } from 'discord.js/typings/index.js'
import dayjs from 'dayjs'

export async function PostDiscord(embeds: MessageEmbed[], client: Client<boolean>) {
  try {
    const channel = client.channels.cache.get(DISCORD_CHANNEL_ID) as TextChannel
    await channel.send({ embeds: embeds })
  } catch (e: any) {
    console.log(e)
  }
}

export function activityString(trade: TradeDto) {
  return `${trade.asset} ${dayjs(trade.expiry).format('DD MMM')} ${trade.isCall ? 'C' : 'P'} $${trade.strike} x ${
    trade.size
  }`
}

export async function defaultActivity(client: Client<boolean>) {
  const network = TESTNET ? 'Kovan' : 'Avalon'

  client.user?.setActivity(`${network} Trades`, { type: 'WATCHING' })
}
