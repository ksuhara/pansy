
export const chainList = [
  'aptos',
  'sui',
] as const;

export type ChainName = typeof chainList[number];

export type NetworkProfile = {
  chain: ChainName
  sub: string
  icon: string
};

// export const NetworkBook: Record<unknown, NetworkProfile> = {
export const NetworkBook = {
  AptosMainnet: {
    chain: 'aptos',
    sub: 'mainnet',
    icon: 'https://assets.coingecko.com/coins/images/26455/small/aptos_round.png?1666839629',
  },
  SuiDevnet: {
    chain: 'sui',
    sub: 'devnet',
    icon: 'https://cryptototem.com/wp-content/uploads/2022/08/SUI-logo.jpg',
  }
} as const;

export type NetworkBook = typeof NetworkBook[keyof typeof NetworkBook];
export type NetworkName = keyof typeof NetworkBook;
