import { StaticJsonRpcProvider } from '@ethersproject/providers'

import { Chain } from '../../src/constants/chain'
import Lyra, { Version } from '../../src/lyra'
import getLyraDeploymentChainId from '../../src/utils/getLyraDeploymentChainId'
import getLyraDeploymentRPCURL from '../../src/utils/getLyraDeploymentRPCURL'
import coerce from './coerce'

export default function getLyra(): Lyra {
  const chain = coerce(Chain, process.env.CHAIN ?? '', Chain.Optimism)
  const version = coerce(Version, process.env.VERSION ?? '', Version.Avalon)
  const chainId = getLyraDeploymentChainId(chain)
  const rpcUrl = process.env.RPC_URL ?? getLyraDeploymentRPCURL(chain)
  const lyra = new Lyra(
    {
      provider: new StaticJsonRpcProvider(rpcUrl, chainId),
      optimismProvider: new StaticJsonRpcProvider(
        getLyraDeploymentRPCURL(Chain.Optimism),
        getLyraDeploymentChainId(Chain.Optimism)
      ),
    },
    version
  )
  return lyra
}
