import { Client, GatewayIntentBits, Partials } from 'discord.js'

export function DiscordClient() {
  return new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    partials: [Partials.User, Partials.Message],
  })
}
