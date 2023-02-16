import { Network } from '@lyrafinance/lyra-js'
import { EmbedBuilder } from 'discord.js'
import { bannerUrls, iconUrls } from '../constants/urls'
import { Trader } from '../types/lyra'
import formatUSD from '../utils/formatUSD'
import { DisplayTrader, LyraDappUrl, Medal, NetworkFooter, PortfolioLink } from './common'

export function LeaderboardDiscord(leaderBoard: Trader[], network: Network): EmbedBuilder[] {
  const messageEmbeds: EmbedBuilder[] = []

  const tradeEmbed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(`Top ${leaderBoard.length} Profitable Traders`)
    .addFields(
      { name: 'Trader', value: '-------------', inline: true },
      { name: `\u200b`, value: '-------------', inline: true },
      { name: '💵 Profit', value: '-------------', inline: true },
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
      const embed = new EmbedBuilder().setColor('#0099ff')

      group.map((trader) => {
        return leaderBoardRow(embed, trader)
      })
      messageEmbeds.push(embed)
      group = []
    }
    return group
  }, traders)

  messageEmbeds.map((embed) => embed.setImage(bannerUrls.spacer))

  if (messageEmbeds.length > 0) {
    const embedLast = messageEmbeds.pop()
    if (embedLast) {
      embedLast.setFooter({
        iconURL: `${network === Network.Optimism ? iconUrls.optimism : iconUrls.arbitrum}`,
        text: `${network === Network.Optimism ? 'Optimism' : 'Arbitrum'}`,
      })
      embedLast.setImage(network === Network.Optimism ? bannerUrls.optimism : bannerUrls.arbitrum).setTimestamp()
      messageEmbeds.push(embedLast)
    }
  }
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
      name: `Open Trade`,
      value: `${trader.unrealizedPnl != 0 ? '✅' : '❌'}`,
      inline: true,
    },
    {
      name: `${formatUSD(trader.realizedPnl)}`,
      value: `[view account](${PortfolioLink(trader.account)})`,
      inline: true,
    },
  )
}

export function LeaderboardTwitter(leaderBoard: Trader[]) {
  const post: string[] = []
  post.push(`✅ Top 5 Lyra Profitable Traders 💵 💰 🤑\n`)
  leaderBoard.slice(0, 5).map((trader) => {
    post.push(
      `${Medal(trader.position)} ${trader.position}.  ${DisplayTrader(trader, false)}  💵 ${formatUSD(
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
  post.push(`============================\n`)
  leaderBoard.slice(0, 10).map((trader) => {
    post.push(
      `${Medal(trader.position)} ${trader.position}. <a href='${PortfolioLink(trader.account)}'>${DisplayTrader(
        trader,
        false,
      )}</a> ${formatUSD(trader.realizedPnl)}\n`,
    )
  })
  post.push(`============================\n`)
  return post.join('')
}
