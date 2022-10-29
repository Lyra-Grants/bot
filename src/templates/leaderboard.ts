import { EmbedBuilder } from 'discord.js'
import { Trader } from '../types/lyra'
import { dollar } from '../utils/utils'
import { DisplayTrader, LyraDappUrl, Medal, PortfolioLink } from './common'

export function LeaderboardDiscord(leaderBoard: Trader[]): EmbedBuilder[] {
  const messageEmbeds: EmbedBuilder[] = []

  const tradeEmbed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(`Top ${leaderBoard.length} Lyra Profitable Traders`)
    .setDescription(`Last 1000 positions`)
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

  const traders: Trader[] = []

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

export function leaderBoardRow(tradeEmbed: EmbedBuilder, trader: Trader): EmbedBuilder {
  return tradeEmbed.addFields(
    {
      name: `${Medal(trader.position)} ${trader.position}.`,
      value: `${DisplayTrader(trader, true)}`,
      inline: true,
    },
    {
      name: `${dollar(trader.realizedPnl)}`,
      value: `[view account](${PortfolioLink(trader.account)})`,
      inline: true,
    },
    {
      name: `\u200B`,
      value: `\u200B`,
      inline: true,
    },
  )
}

export function LeaderboardTwitter(leaderBoard: Trader[]) {
  const post: string[] = []
  post.push(`✅ Top 5 Lyra Profitable Traders 💵 💰 🤑\n`)
  leaderBoard.slice(0, 5).map((trader) => {
    post.push(
      `${Medal(trader.position)} ${trader.position}.  ${DisplayTrader(trader, false)}  💵 ${dollar(
        trader.realizedPnl,
      )}\n`,
    )
  })
  post.push(`\nOptions for everyone, start trading 👇\n`)
  post.push(`${LyraDappUrl()}`)
  return post.join('')
}

export function LeaderboardTelegram(leaderBoard: Trader[]) {
  const post: string[] = []
  post.push(`✅ Top 10 Lyra Traders 💵 💰 🤑\n`)
  post.push(`Profits from last 1000 positions.\n`)
  post.push(`============================\n`)
  leaderBoard.slice(0, 10).map((trader) => {
    post.push(
      `${Medal(trader.position)} ${trader.position}. <a href='${PortfolioLink(trader.account)}'>${DisplayTrader(
        trader,
        false,
      )}</a> ${dollar(trader.realizedPnl)}\n`,
    )
  })
  post.push(`============================\n`)
  return post.join('')
}
