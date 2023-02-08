import {
  AptosWalletAdapter, BitkeepWalletAdapter, FewchaWalletAdapter,
  MartianWalletAdapter,
  PontemWalletAdapter,
  RiseWalletAdapter
} from '@manahippo/aptos-wallet-adapter';
import { WalletStandardAdapterProvider } from '@mysten/wallet-adapter-all-wallets';
import type { WhiteWalletName } from 'umi-sdk/src/types/wallet';

export const wallets = () => [
  new MartianWalletAdapter(),
  new AptosWalletAdapter(),
  new FewchaWalletAdapter(),
  new PontemWalletAdapter(),
  new BitkeepWalletAdapter(),
  new RiseWalletAdapter(),
  // new HippoWalletAdapter(),
];

export const installationURI: Record<WhiteWalletName, string | undefined> = {
  'Martian': 'https://chrome.google.com/webstore/detail/martian-aptos-wallet/efbglgofoippbgcjepnhiblaibcnclgk',
  'Petra': 'https://chrome.google.com/webstore/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci',
  'Fewcha': 'https://chrome.google.com/webstore/detail/fewcha-aptos-wallet/ebfidpplhabeedpnhjnobghokpiioolj',
  'Pontem': 'https://chrome.google.com/webstore/detail/pontem-aptos-wallet/phkbamefinggmakgklpkljjmgibohnba',
  'BitKeep': 'https://chrome.google.com/webstore/detail/bitkeep-crypto-nft-wallet/jiidiaalihmmhddjgbnbgdfflelocpak',
  'Rise Wallet': 'https://chrome.google.com/webstore/detail/rise-wallet/hbbgbephgojikajhfbomhlmmollphcad',
  // 'Hippo Web Wallet': undefined
};

export const SuiAdapterList = () => [
  new WalletStandardAdapterProvider(),
  // new UnsafeBurnerWalletAdapter(),
];
