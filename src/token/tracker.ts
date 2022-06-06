import { optimsimProvider } from '../clients/ethersClient'
import { LYRA_TOKEN } from '../utils/secrets'
import { ERC20__factory } from '@lyrafinance/lyra-js'
import fromBigNumber from '../utils/fromBigNumber'
import { BigNumber } from 'ethers'
import { TransferEvent } from '@lyrafinance/lyra-js/dist/types/contracts/typechain/ERC20'
import { Client } from 'discord.js'
import { TransferDto } from '../types/transferDto'
import { PostDiscord } from '../integrations/discord'
import { TradeDiscord, TransferDiscord } from '../utils/template'
import { GetEns } from '../integrations/ens'

export async function TrackTokenMoves(discordClient: Client<boolean>): Promise<void> {
  console.debug(`Tracking token moves`)
  const token = ERC20__factory.connect(LYRA_TOKEN, optimsimProvider)

  token.on('Transfer', async (from: string, to: string, value: BigNumber, event: TransferEvent) => {
    const fromEns = await GetEns(from)
    const toEns = await GetEns(to)

    const transfer: TransferDto = {
      from: from,
      to: to,
      value: fromBigNumber(value),
      transactionHash: event.transactionHash,
      fromEns: fromEns,
      toEns: toEns,
    }
    if (transfer.value >= 400) {
      console.debug('broad casting transfer')
      BroadCastTransfer(transfer, discordClient)
    }
  })
}

export async function BroadCastTransfer(transfer: TransferDto, discordClient: Client<boolean>): Promise<void> {
  //Discord
  const post = TransferDiscord(transfer)
  console.debug(transfer)
  await PostDiscord(post, discordClient, 'lyra-token-transfers')
}
