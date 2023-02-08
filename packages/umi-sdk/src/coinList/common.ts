export const coinOrder = [
  // measure
  'SOL',
  'APT',
  'ETH',
  'zWETH',
  'BTC',
  // stable
  'USDA',
  'USDI',
  'BUSD',
  'USDC',
  'USDT',

  'ceBUSD',
  'ceUSDC',
  'ceUSDT',
  'ceDAI',

  'whBUSD',
  'whUSDC',
  'whUSDT',
  'whDAI',

  'zBUSD',
  'zUSDC',
  'zUSDT',
  'zDAI',
];

export const measures = {
  BTC: {
    symbol: 'BTC',
    decimals: 8,
    logoURI: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579',
    extensions: {
      coingeckoId: 'bitcoin',
      yfSymbol: 'BTC-USD',
    }
  },
  ETH: {
    symbol: 'ETH',
    decimals: 8,
    logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
    extensions: {
      coingeckoId: 'ethereum',
      yfSymbol: 'ETH-USD',
    }
  },
  USDT: {
    symbol: 'USDT',
    decimals: 8,
    logoURI: 'https://assets.coingecko.com/coins/images/325/small/Tether-logo.png?1598003707',
    extensions: {
      coingeckoId: 'tether',
      yfSymbol: 'USDT-USD',
    }
  },
  USDC: {
    symbol: 'USDC',
    decimals: 8,
    logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389',
    extensions: {
      coingeckoId: 'usd-coin',
      yfSymbol: 'USDT-USD',
    }
  },
  SOL: {
    symbol: 'SOL',
    decimals: 8,
    logoURI: 'https://assets.coingecko.com/coins/images/4128/small/solana.png?1640133422',
    extensions: {
      address: '0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68',
      coingeckoId: 'solana',
      yfSymbol: 'SOL-USD',
    }
  },
};
