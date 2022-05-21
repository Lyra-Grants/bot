import { TradeDto } from '../types/tradeDto'
import { DISCORD_CHANNEL_ID, TESTNET } from '../utils/secrets'
import { GenerateEmbed } from '../utils/template'
import { Client, TextChannel } from 'discord.js/typings/index.js'
import dayjs from 'dayjs'

export async function PostDiscord(trade: TradeDto, client: Client<boolean>) {
  try {
    const message = GenerateEmbed(trade)
    const channel = client.channels.cache.get(DISCORD_CHANNEL_ID) as TextChannel
    await channel.send({ embeds: [message] })

    client?.user?.setActivity(activityString(trade), { type: 'WATCHING' })

    const waitFor = (delay: number, client: Client<boolean>) =>
      new Promise(() =>
        setTimeout(() => {
          defaultActivity(client)
        }, delay),
      )

    await waitFor(60000, client)
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
