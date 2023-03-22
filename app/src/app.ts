import { Telegraf } from 'telegraf'
import { Run } from './bot'
import { PostTelegram } from './integrations/telegram'
import { LOG_CHANNEL, LOG_TOKEN } from './secrets'

async function Initialize(): Promise<void> {
  try {
    RegisterShutdownEvents()
    await Notifier(false)
    await Run()
  } catch (error) {
    console.error(error)
  }
}

async function Notifier(isDown = true) {
  await PostTelegram(`⚡ Lyra Bot ${isDown ? 'Down' : 'Up'}\n`, new Telegraf(LOG_TOKEN), LOG_CHANNEL)
}

function RegisterShutdownEvents(): void {
  process.on('uncaughtException', async (error) => {
    console.log('Uncaught error!')
    await Notifier()
    await PostTelegram(`Error:\n\n ${error.message}`, new Telegraf(LOG_TOKEN), LOG_CHANNEL)

    console.error(error)
  })

  process.on('beforeExit', async (code) => {
    await Notifier().then(process.exit(code))
  })
}

Initialize()
