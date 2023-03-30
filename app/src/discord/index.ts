import { GetLeaderBoard, ParsePositionLeaderboard } from '../lyra/leaderboard'
import { DISCORD_ENABLED, TESTNET } from '../secrets'
import { ChatInputCommandInteraction, Client, GuildBasedChannel, TextChannel } from 'discord.js'
import { defaultActivity, defaultName } from '../integrations/discord'
import { Network } from '@lyrafinance/lyra-js'
import { LeaderboardDiscord } from '../templates/leaderboard'
import { GetStats } from '../lyra/stats'
import { StatDiscord } from '../templates/stats'
import { ARBS_CHANNEL, STATS_CHANNEL, TOKEN_CHANNEL, TRADE_CHANNEL } from '../constants/discordChannels'
import { HelpDiscord } from '../templates/help'
import { GetArbitrageDeals } from '../lyra/arbitrage'
import { ArbDiscord } from '../templates/arb'
import { GetTrader } from '../lyra/trader'
import { TraderDiscord } from '../templates/trader'

export async function SetUpDiscord(
  discordClient: Client<boolean>,
  market: string,
  accessToken: string,
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
      const arbChannel = interaction?.guild?.channels?.cache?.find((channel) => channel.name === ARBS_CHANNEL)
      const channelName = (interaction?.channel as TextChannel).name
      const { commandName } = interaction

      if (market == 'eth') {
        if (commandName === 'leaderboard') {
          await LeaderBoardInteraction(
            channelName,
            interaction as ChatInputCommandInteraction,
            tradeChannel as GuildBasedChannel,
            10,
            commandName,
          )
        }
        if (commandName === 'top30') {
          await LeaderBoardInteraction(
            channelName,
            interaction as ChatInputCommandInteraction,
            tradeChannel as GuildBasedChannel,
            30,
            commandName,
          )
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
        if (commandName === 'trader') {
          await TraderInteraction(
            channelName,
            interaction as ChatInputCommandInteraction,
            tradeChannel as GuildBasedChannel,
          )
        }
      }

      if (commandName === 'arbs') {
        await ArbInteraction(
          market,
          channelName,
          interaction as ChatInputCommandInteraction,
          arbChannel as GuildBasedChannel,
        )
      }

      if (commandName === 'stats') {
        await StatsInteraction(
          market,
          channelName,
          interaction as ChatInputCommandInteraction,
          statsChannel as GuildBasedChannel,
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

async function LeaderBoardInteraction(
  channelName: string,
  interaction: ChatInputCommandInteraction,
  channel: GuildBasedChannel,
  take: number,
  commandName: string,
) {
  if (channelName === TRADE_CHANNEL) {
    await interaction.deferReply()
    const network = interaction.options.getString('chain') as Network
    const leaderBoard = await GetLeaderBoard(network)
    const traders = await Promise.all(
      leaderBoard.slice(0, take).map(async (x, index) => await ParsePositionLeaderboard(x, index + 1)),
    )
    const embeds = LeaderboardDiscord(traders, network)
    await interaction.editReply({ embeds: embeds })
  } else {
    await interaction.reply(`Command ${commandName} only available in <#${channel?.id}>`)
  }
}

async function StatsInteraction(
  market: string,
  channelName: string,
  interaction: ChatInputCommandInteraction,
  channel: GuildBasedChannel,
) {
  if (channelName === STATS_CHANNEL) {
    await interaction.deferReply()
    const network = interaction.options.getString('chain') as Network
    const statsDto = await GetStats(market, network)
    const stats = StatDiscord(statsDto, network)
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
) {
  if (channelName === ARBS_CHANNEL) {
    await interaction.deferReply()
    const network = interaction.options.getString('chain') as Network
    const arbs = await GetArbitrageDeals(market, network)
    if (arbs.arbs.length > 0) {
      const { embeds, rows } = ArbDiscord(arbs, network)
      await interaction.editReply({ embeds: embeds, components: rows })
    } else {
      await interaction.editReply(`No ${market} arbs found on ${network}.`)
    }
  } else {
    await interaction.reply(`Command 'arbs' only available in <#${channel?.id}>`)
  }
}

async function TraderInteraction(
  channelName: string,
  interaction: ChatInputCommandInteraction,
  channel: GuildBasedChannel,
) {
  if (channelName === TRADE_CHANNEL) {
    await interaction.deferReply()
    const account = interaction.options.getString('account') as string
    // todo support both networks
    const trader = await GetTrader(account, Network.Optimism)
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
