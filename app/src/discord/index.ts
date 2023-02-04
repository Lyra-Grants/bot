import { ParsePositionLeaderboard } from '../lyra/leaderboard'
import { DISCORD_ENABLED, TESTNET } from '../secrets'
import { ChatInputCommandInteraction, Client, EmbedBuilder, GuildBasedChannel, TextChannel } from 'discord.js'
import { defaultActivity, defaultName } from '../integrations/discord'
import Lyra from '@lyrafinance/lyra-js'
import { LeaderboardDiscord } from '../templates/leaderboard'
import { GetStats } from '../lyra/stats'
import { StatDiscord } from '../templates/stats'
import { ARBS_CHANNEL, STATS_CHANNEL, TOKEN_CHANNEL, TRADE_CHANNEL } from '../constants/discordChannels'
import { HelpDiscord, QuantDiscord } from '../templates/help'
import { CoinGeckoDiscord } from '../templates/coingecko'
import { GetCoinGecko } from '../lyra/coingecko'
import { GetArbitrageDeals } from '../lyra/arbitrage'
import { ArbDiscord } from '../templates/arb'
import { GetTrader } from '../lyra/trader'
import { TraderDiscord } from '../templates/trader'

export async function SetUpDiscord(
  discordClient: Client<boolean>,
  market: string,
  accessToken: string,
  lyra: Lyra,
): Promise<Client<boolean>> {
  if (DISCORD_ENABLED) {
    discordClient.on('ready', async (client) => {
      console.debug(`Discord bot ${market}  is online!`)
    })

    discordClient.on('interactionCreate', async (interaction) => {
      if (!interaction.isCommand()) {
        return
      }

      const tradeChannel = interaction?.guild?.channels.cache.find((channel) => channel.name === TRADE_CHANNEL)
      const statsChannel = interaction?.guild?.channels.cache.find((channel) => channel.name === STATS_CHANNEL)
      const tokenChannel = interaction?.guild?.channels.cache.find((channel) => channel.name === TOKEN_CHANNEL)
      const arbChannel = interaction?.guild?.channels?.cache?.find((channel) => channel.name === ARBS_CHANNEL)
      const channelName = (interaction?.channel as TextChannel).name
      const { commandName } = interaction

      // eth only
      if (market == 'eth') {
        if (commandName === 'leaderboard') {
          await interaction.deferReply()
          if (channelName === TRADE_CHANNEL) {
            const traders = await Promise.all(
              global.LYRA_LEADERBOARD.slice(0, 10).map(
                async (x, index) => await ParsePositionLeaderboard(x, index + 1),
              ),
            )
            const post = LeaderboardDiscord(traders)
            await interaction.editReply({ embeds: post })
          } else {
            await interaction.reply(`Command 'leaderboard' only available in <#${tradeChannel?.id}>`)
          }
        }
        if (commandName === 'top30') {
          if (channelName === TRADE_CHANNEL) {
            await interaction.deferReply()
            const traders = await Promise.all(
              global.LYRA_LEADERBOARD.slice(0, 30).map(
                async (x, index) => await ParsePositionLeaderboard(x, index + 1),
              ),
            )
            const post = LeaderboardDiscord(traders)
            await interaction.editReply({ embeds: post })
          } else {
            await interaction.reply(`Command 'top30' only available in <#${tradeChannel?.id}>`)
          }
        }
        if (commandName === 'help') {
          if (channelName === STATS_CHANNEL || channelName === TRADE_CHANNEL) {
            const help = HelpDiscord()
            await interaction.reply(help)
          } else {
            await interaction.reply(
              `Command 'help' only available in <#${statsChannel?.id}> or <#${tradeChannel?.id}> `,
            )
          }
        }
        if (commandName === 'lyra') {
          if (channelName === TOKEN_CHANNEL) {
            await interaction.deferReply()
            const lyraDto = await GetCoinGecko()
            const embed = CoinGeckoDiscord(lyraDto)
            await interaction.editReply({ embeds: embed })
          } else {
            await interaction.reply(`Command 'lyra' only available in <#${tokenChannel?.id}>`)
          }
        }
        if (commandName === 'quant') {
          const embed = QuantDiscord()
          await interaction.reply({ embeds: embed })
        }
        if (commandName === 'trader') {
          await TraderInteraction(
            channelName,
            interaction as ChatInputCommandInteraction,
            tradeChannel as GuildBasedChannel,
            lyra,
          )
        }
      }

      if (commandName === 'arbs') {
        await ArbInteraction(
          market,
          channelName,
          interaction as ChatInputCommandInteraction,
          arbChannel as GuildBasedChannel,
          lyra,
        )
      }

      if (commandName === 'stats') {
        await StatsInteraction(
          market,
          channelName,
          interaction as ChatInputCommandInteraction,
          statsChannel as GuildBasedChannel,
          lyra,
        )
      }
    })
    await discordClient.login(accessToken)
    if (!TESTNET) {
      defaultActivity(discordClient, market)
      await defaultName(discordClient, market)
    }
  }
  return discordClient
}

async function StatsInteraction(
  market: string,
  channelName: string,
  interaction: ChatInputCommandInteraction,
  channel: GuildBasedChannel,
  lyra: Lyra,
) {
  if (channelName === STATS_CHANNEL) {
    await interaction.deferReply()
    const statsDto = await GetStats(market, lyra)
    const stats = StatDiscord(statsDto)
    await interaction.editReply({ embeds: stats })
  } else {
    await interaction.reply(`Command 'stats' only available in <#${channel?.id}>`)
  }
}

async function ArbInteraction(
  market: string,
  channelName: string,
  interaction: ChatInputCommandInteraction,
  channel: GuildBasedChannel,
  lyra: Lyra,
) {
  if (channelName === ARBS_CHANNEL) {
    await interaction.deferReply()
    const arbs = await GetArbitrageDeals(lyra, market)
    if (arbs.arbs.length > 0) {
      const embed = ArbDiscord(arbs)
      await interaction.editReply({ embeds: embed })
    } else {
      await interaction.editReply(`No ${market} arbs found.`)
    }
  } else {
    await interaction.reply(`Command 'arbs' only available in <#${channel?.id}>`)
  }
}

async function TraderInteraction(
  channelName: string,
  interaction: ChatInputCommandInteraction,
  channel: GuildBasedChannel,
  lyra: Lyra,
) {
  if (channelName === TRADE_CHANNEL) {
    await interaction.deferReply()
    const account = interaction.options.getString('account') as string
    const trader = await GetTrader(account, lyra)
    if (trader.account != '') {
      const embed = TraderDiscord(trader)
      await interaction.editReply({ embeds: embed })
    } else {
      await interaction.editReply(`No trader '${account}' found.`)
    }
  } else {
    await interaction.reply(`Command 'trader' only available in <#${channel?.id}>`)
  }
}
