export const degenMessage = [
  "YOLO'd",
  'Feeling Bullish',
  'gm! 🚀',
  'Gud trade',
  'No game, no life',
  'Action bet!!',
  'Fight Beras',
  'Glad, I bought some puts',
  'Green Candles Only, no stop loss',
  '🐵 Apes Strong',
  'been sober for 3 days now. feeling great',
  '🐵 Ape Strategy',
  'reverse iron albatross spread?',
  '🐵 🤝 🐵',
  'Leverage, LFG!!',
  'pamp Fudzy',
  'Apes think alike',
  'Why do we always buy the top?',
  '🦧 ALWAYS WIN',
  'Apes must learn',
  "Wait, so what's my portfolio worth rn?",
  'did we really convert 10k into 700$?',
  'Irresponsibly long',
  'swift recovery of funds inbound',
  'I think this is how the fed works.',
  'Getting rekt fast 101.',
  'Make it all back with 1 trade',
  'Down bad?',
  "I'm so proud of every last one of you guys.",
  'Up only!',
  'Just setting up a comeback story is all.',
  'Completely unpredictable',
  "as long as it's green its a huge improvement over last time",
  "triple the portfolio value now and we'll be close to breakeven",
  'oooo boy, we gmi',
  'literally left it to randomness?',
  'whatever we do the market does the opposite',
  "Can't go wrong more than once",
  'Till expiry or bust',
  'the market exists purely to mock the apes',
  'crypto is ded',
  'pls muh familia',
  'globla marco pump?',
  'is that good for stakers?',
  'triple halvening my ass',
  'scared to do mainnet transaction?',
  'ooo special sandwich tonight',
  'beans',
  'obscure crypto mechanics is reflected in relative performance',
  'best one yet',
  'Oooo its a crime?',
  'now were talkin',
  'banks started getting scared',
  'im not even sure how this is possible',
  'max bidding',
  'i think there is a UI problem',
  'Seems markets are risk on again',
  'Have the unwashed masses of CT accepted the Book of Lyra yet?',
  'okay, who sold?',
  'dis is me, yes',
  'What are you doing with your profits today?',
  'You want her to cover herself in peanut butter?',
  'fundametally speaking, i know everything on Optimism pumped',
  'tonight i learned canberra is capital of australia',
  'idk how giga brain muir does it',
  'This is why v2 hasnt shipped',
]

export function RandomDegen(): string {
  const random = Math.floor(Math.random() * degenMessage.length)
  return degenMessage[random]
}
