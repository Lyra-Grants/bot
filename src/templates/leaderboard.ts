import { EmbedBuilder } from 'discord.js'
import { trader } from '../types/trader'
import { shortAddress } from '../utils/utils'
import { Medal, PortfolioLink } from './common'

export function LeaderboardDiscord(leaderBoard: trader[]): EmbedBuilder[] {
  const messageEmbeds: EmbedBuilder[] = []

  const tradeEmbed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(`Top ${leaderBoard.length} Lyra Profitable Traders`)
    .setDescription(`Last 1000 positions (unrealised profit).`)
    .addFields(
      { name: 'Trader', value: '-----------', inline: true },
      { name: '💵 Profit', value: '-----------', inline: true },
      { name: `\u200B`, value: `\u200B`, inline: true },
    )
  //\u200b
  leaderBoard.slice(0, 5).map((trader) => {
    return leaderBoardRow(tradeEmbed, trader)
  })
  messageEmbeds.push(tradeEmbed)

  const traders: trader[] = []

  // skip 5 until end
  leaderBoard.slice(5).reduce((group, trader, index) => {
    group.push(trader)
    if (index % 5 === 4) {
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setDescription(`--------------------------------------------`)
      group.map((trader) => {
        return leaderBoardRow(embed, trader)
      })
      messageEmbeds.push(embed)
      group = []
    }
    return group
  }, traders)

  return messageEmbeds
}

export function leaderBoardRow(tradeEmbed: EmbedBuilder, trader: trader): EmbedBuilder {
  return tradeEmbed.addFields(
    {
      name: `${Medal(trader.position)} ${trader.position}.`,
      value: `${trader.ens ? trader.ens : shortAddress(trader.owner)}`,
      inline: true,
    },
    {
      name: `${trader.netPremiumsFormatted}`,
      value: `${trader.openOptionsFormatted == '' ? '(0)' : trader.openOptionsFormatted}`,
      inline: true,
    },
    {
      name: `\u200B`,
      value: `\u200B`,
      inline: true,
    },
  )
}

export function LeaderboardTwitter(leaderBoard: trader[]) {
  const post: string[] = []
  post.push(`✅ Top 5 Lyra Profitable Traders 💵 💰 🤑\n`)
  leaderBoard.slice(0, 5).map((trader) => {
    post.push(
      `${Medal(trader.position)} ${trader.position}.  ${trader.ens ? trader.ens : shortAddress(trader.owner)}  💵 ${
        trader.netPremiumsFormatted
      }\n`,
    )
  })
  post.push(`\nOptions for everyone, start trading 👇\n`)
  post.push(`https://app.lyra.finance`)
  return post.join('')
}

export function LeaderboardTelegram(leaderBoard: trader[]) {
  const post: string[] = []
  post.push(`✅ Top 10 Lyra Traders 💵 💰 🤑\n`)
  post.push(`Profits from last 1000 positions.\n`)
  post.push(`============================\n`)
  leaderBoard.slice(0, 10).map((trader) => {
    post.push(
      `${Medal(trader.position)} ${trader.position}. <a href='${PortfolioLink(trader.owner)}'>${
        trader.ens ? trader.ens : shortAddress(trader.owner)
      }</a> ${trader.netPremiumsFormatted}\n`,
    )
  })
  post.push(`============================\n`)
  return post.join('')
}
