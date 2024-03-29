import { TELEGRAM_CHANNEL, TELEGRAM_ENABLED, TESTNET } from '../config'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'

export async function PostTelegram(
  post: string,
  telegramClient: Telegraf<Context<Update>>,
  channel: string = TELEGRAM_CHANNEL,
) {
  if (TESTNET || !TELEGRAM_ENABLED) {
    console.log(post)
  } else {
    try {
      const response = await telegramClient.telegram.sendMessage(channel, post, {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      })
    } catch (e: any) {
      console.log(e)
    }
  }
}
