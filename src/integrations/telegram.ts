import { TradeDto } from '../types/tradeDto'
import { GenerateHtmlPost } from '../utils/template'
import { TELEGRAM_CHANNEL, TELEGRAM_ENABLED } from '../utils/secrets'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'

export async function PostTelegram(trade: TradeDto, telegramClient: Telegraf<Context<Update>>) {
  try {
    const post = GenerateHtmlPost(trade)
    const response = await telegramClient.telegram.sendMessage(TELEGRAM_CHANNEL, post, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    })
  } catch (e: any) {
    console.log(e)
  }
}
