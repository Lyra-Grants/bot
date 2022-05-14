import { TradeDto } from '../types/tradeDto'
import { TelegramClient } from '../clients/telegramClient'
import { GenerateHtmlPost } from '../utils/template'
import { TELEGRAM_CHANNEL, TELEGRAM_ENABLED } from '../utils/secrets'

export async function PostTelegram(trade: TradeDto) {
  if (TELEGRAM_ENABLED) {
    const post = GenerateHtmlPost(trade)
    console.log(post)

    try {
      const response = await TelegramClient.telegram.sendMessage(TELEGRAM_CHANNEL, post, {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      })
    } catch (e: any) {
      console.log(e)
    }
  }
}
