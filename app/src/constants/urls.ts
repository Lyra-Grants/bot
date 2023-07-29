export const urls = {
  dexscreenerUrl: 'https://api.dexscreener.com/latest/dex/tokens/',
  etherleaderboardApiUrl: 'https://ethleaderboard.xyz/api/frens',
  polynomialDappUrl: 'https://earn.polynomial.fi',
  brahmaDappUrl: 'https://app.brahma.fi',
  dHedgeDappUrl: 'https://app.dhedge.org',
  leaderboardApiUrl: 'https://api.lyra.finance/leaderboard',
}

export const iconUrls = {
  lyra: 'https://raw.githubusercontent.com/ethboi/assets/main/general/lyra.png',
}

export const bannerUrls = {
  lyra: 'https://raw.githubusercontent.com/ethboi/assets/main/lyra-bg.jpg',
  spacer: 'https://raw.githubusercontent.com/ethboi/assets/main/spacer.jpg',
}

export type AssetType = 'eth' | 'wbtc' | 'op' | 'arb' | 'btc'

export const thumbUrls: Record<AssetType, string> = {
  eth: 'https://raw.githubusercontent.com/ethboi/assets/main/discord/eth.png',
  wbtc: 'https://raw.githubusercontent.com/ethboi/assets/main/discord/wbtc.png',
  op: 'https://raw.githubusercontent.com/ethboi/assets/main/discord/op.png',
  arb: 'https://raw.githubusercontent.com/ethboi/assets/main/discord/arb.png',
  btc: 'https://raw.githubusercontent.com/ethboi/assets/main/discord/wbtc.png',
}
