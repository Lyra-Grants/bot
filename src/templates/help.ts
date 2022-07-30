import { MessageEmbed } from 'discord.js'

export function HelpDiscord(): string {
  const post: string[] = []
  post.push('```\n')
  post.push('============================================\n')
  post.push('COMMAND          | DESCRIPTION\n')
  post.push('============================================\n')
  post.push('/top30           | Top 30 traders\n')
  post.push('/leaderboard     | Top 10 traders\n')
  post.push('/stats <vault>   | Vault stats\n')
  post.push('/lyra            | LYRA info\n')
  post.push('/quant           | Completely sure of the math?\n')
  // post.push('/trader <addr>   | Last 5 trades\n')

  post.push('```\n')
  return post.join('')
}

export function QuantDiscord(): MessageEmbed[] {
  const messageEmbeds: MessageEmbed[] = []
  const embed = new MessageEmbed()
  embed.setImage(
    'https://github.com/Lyra-Grants/lyra-avalon-bot/blob/c05bc1e3595ae80d74a37f13da7ce78b219a0b06/src/img/quant.png?raw=true',
  )
  messageEmbeds.push(embed)
  return messageEmbeds
}
