import { EmbedBuilder } from 'discord.js'
import { Trader } from '../types/lyra'
import { dollar } from '../utils/utils'
import { DisplayTrader, DisplayTraderNoEmoji, FN, FNS, LyraDappUrl, Medal, PortfolioLink, TwitterLink } from './common'

export function TraderDiscord(trader: Trader): EmbedBuilder[] {
  const messageEmbeds: EmbedBuilder[] = []

  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(`${trader.account}`)
    .setDescription(`${Medal(trader.position)} #${trader.position} Leaderboard`)
    .setURL(`${PortfolioLink(trader.account)}`)

    .addFields(
      {
        name: '👨 Trader',
        value: `> ${DisplayTraderNoEmoji(trader)}`,
        inline: false,
      },
      { name: 'Realized Pnl', value: `> ${dollar(trader.realizedPnl)}`, inline: false },
      { name: 'Unrealized Pnl', value: `> ${dollar(trader.unrealizedPnl)}`, inline: false },
      {
        name: 'Realized Long Pnl',
        value: `> ${dollar(trader.realizedLongPnl)} (${FNS(trader.realizedLongPnlPercentage, 2)}%)`,
        inline: false,
      },
      {
        name: 'Unrealized Pnl',
        value: `> ${dollar(trader.unrealizedPnl)}  (${FNS(trader.unrealizedLongPnlPercentage, 2)}%)`,
        inline: false,
      },
      {
        name: 'Total Premiums',
        value: `> ${dollar(trader.totalPremiums)}`,
        inline: false,
      },
      {
        name: 'Total Long Premiums',
        value: `> ${dollar(trader.totalLongPremiums)}`,
        inline: false,
      },
      {
        name: 'Total Notional Volume',
        value: `> ${dollar(trader.totalNotionalVolume)}`,
        inline: false,
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
  if (trader.url) {
    embed.addFields({ name: '👉 Go to Vault', value: `>[deposit into vault] (${trader.url})`, inline: false })
  }
  messageEmbeds.push(embed)
  return messageEmbeds
}
