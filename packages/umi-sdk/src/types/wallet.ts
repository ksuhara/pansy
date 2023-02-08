export const whiteWalletNames = [
  'Aptos Wallet',
  'MartianWallet',
  'Fewcha Wallet',
  'PontemWallet',
  'Hippo Web Wallet',
] as const;

export type WhiteWalletName = typeof whiteWalletNames[number];
