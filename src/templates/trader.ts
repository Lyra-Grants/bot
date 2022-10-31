import { EmbedBuilder } from 'discord.js'
import { Trader } from '../types/lyra'
import { dollar } from '../utils/utils'
import { DisplayTrader, FN, LyraDappUrl, Medal, PortfolioLink, TwitterLink } from './common'

export function TraderDiscord(trader: Trader): EmbedBuilder[] {
  const messageEmbeds: EmbedBuilder[] = []

  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(`${trader.account} Trader Profile`)
    .setDescription(`${Medal(trader.position)} #${trader.position} Leaderboard`)
    .addFields(
      { name: 'Realized Pnl', value: `${dollar(trader.realizedPnl)}`, inline: true },
      { name: 'Unrealized Pnl', value: `${dollar(trader.unrealizedPnl)}`, inline: true },
      {
        name: 'Realized Long Pnl',
        value: `${dollar(trader.realizedLongPnl)} (${FN(trader.realizedLongPnlPercentage, 2)}%)`,
        inline: true,
      },
      {
        name: 'Unrealized Pnl',
        value: `${dollar(trader.unrealizedPnl)}  (${FN(trader.unrealizedLongPnlPercentage, 2)}%)`,
        inline: true,
      },
      {
        name: 'Total Premiums',
        value: `${dollar(trader.totalPremiums)}`,
        inline: true,
      },
      {
        name: 'Total Long Premiums',
        value: `${dollar(trader.totalLongPremiums)}`,
        inline: true,
      },
      {
        name: 'Total Notional Volume',
        value: `${dollar(trader.totalNotionalVolume)}`,
        inline: true,
      },
    )

  if (trader.fren && trader.fren.name) {
    embed.addFields({
      name: `🐦 ${trader.fren.name}`,
      value: `> [view twitter profile](${TwitterLink(trader.fren.handle)})`,
      inline: false,
    })
    if (trader.fren.pfp) {
      embed.setThumbnail(`${trader.fren.pfp}`)
    }
  }
  messageEmbeds.push(embed)
  return messageEmbeds
}
