import { TradeDto } from '../types/tradeDto'
import { DiscordClient } from '../clients/discordClient'
import { DISCORD_ACCESS_TOKEN, DISCORD_CHANNEL_ID, DISCORD_ENABLED } from '../utils/secrets'
import { GenerateEmbed, GenerateHtmlPost } from '../utils/template'
import { Message, MessageEmbed, TextChannel } from 'discord.js/typings/index.js'

export async function PostDiscord(trade: TradeDto) {
  if (DISCORD_ENABLED) {
    const message = GenerateEmbed(trade)

    DiscordClient.on('ready', async (client) => {
      console.log('Discord bot is online!')
    })
    await DiscordClient.login(DISCORD_ACCESS_TOKEN)
    try {
      const channel = DiscordClient.channels.cache.get(DISCORD_CHANNEL_ID) as TextChannel
      await channel.send({ embeds: [message] })
    } catch (e: any) {
      console.log(e)
    }
  }
}
