import { TradeDto } from '../types/tradeDto'
import { DISCORD_CHANNEL_ID } from '../utils/secrets'
import { GenerateEmbed } from '../utils/template'
import { Client, TextChannel } from 'discord.js/typings/index.js'

export async function PostDiscord(trade: TradeDto, client: Client<boolean>) {
  try {
    const message = GenerateEmbed(trade)
    const channel = client.channels.cache.get(DISCORD_CHANNEL_ID) as TextChannel
    await channel.send({ embeds: [message] })
  } catch (e: any) {
    console.log(e)
  }
}
