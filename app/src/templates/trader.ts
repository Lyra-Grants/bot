import { EmbedBuilder } from 'discord.js'
import { Trader } from '../types/lyra'
import formatUSD from '../utils/formatUSD'
import { DisplayTraderNoEmoji, FNS, Medal, PortfolioLink, TwitterLink } from './common'

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
      {
        name: 'Long Pnl',
        value: `> ${formatUSD(trader.longPnl)} (${FNS(trader.longPnlPercentage, 2)}%)`,
        inline: false,
      },
      {
        name: 'Short Pnl',
        value: `> ${formatUSD(trader.shortPnl)} (${FNS(trader.shortPnlPercentage, 2)}%)`,
        inline: false,
      },
      {
        name: 'Realized Pnl',
        value: `> ${formatUSD(trader.realizedPnl)}`,
        inline: false,
      },
      {
        name: 'Unrealized Pnl',
        value: `> ${formatUSD(trader.unrealizedPnl)}  (${FNS(trader.unrealizedPnlPercentage, 2)}%)`,
        inline: false,
      },
      {
        name: 'Initial Cost Of Open',
        value: `> ${formatUSD(trader.initialCostOfOpen)}`,
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
    embed.addFields({ name: '🏦 Vault', value: `> [deposit into vault](${trader.url})`, inline: false })
  }
  messageEmbeds.push(embed)
  return messageEmbeds
}
