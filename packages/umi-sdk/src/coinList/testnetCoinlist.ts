import cUSDIlogo from 'src/assets/cUSDI.png';
import USDIlogo from 'src/assets/USDI.png';
import { protocolBook } from 'umi-sdk/src/protocolList';
import type { CoinProfile } from 'umi-sdk/src/types/coin';
import { measures } from './common';

export const testnetCoinList: CoinProfile[] = [
  {
    chainId: 25,
    address: '0x1::aptos_coin::AptosCoin',
    decimals: 8,
    name: 'Aptos Coin',
    symbol: 'APT',
    logoURI: 'https://pbs.twimg.com/profile_images/1556801889282686976/tuHF27-8_400x400.jpg',
    extensions: {
      coingeckoId: 'aptos',
      yfSymbol: 'APT21794-USD',
    }
  },
  {
    chainId: 25,
    address: `${protocolBook.umi.modules().testnet}::USDI`,
    decimals: 6,
    name: 'ULP',
    symbol: 'ULP',
    logoURI: USDIlogo,
    extensions: {
      coingeckoId: 'frax',
      yfSymbol: 'FRAX-USD',
    }
  },
  {
    chainId: 25,
    address: `${protocolBook.umi.modules().coins}::CUSDI`,
    decimals: 6,
    name: 'cULP',
    symbol: 'cULP',
    logoURI: cUSDIlogo,
    extensions: {
      coingeckoId: 'tether',
      yfSymbol: 'USDT-USD',
    }
  },
  {
    ...measures.BTC,
    chainId: 25,
    address: `${protocolBook.hippo.modules().coins}::DevnetBTC`,
    decimals: 8,
    name: 'BTC.u',
    symbol: 'BTC',
  },
  {
    ...measures.ETH,
    chainId: 25,
    address: `${protocolBook.hippo.modules().coins}::DevnetETH`,
    decimals: 8,
    name: 'ETH.u',
    symbol: 'ETH',
  },
  {
    ...measures.USDT,
    chainId: 25,
    address: `${protocolBook.hippo.modules().coins}::DevnetUSDT`,
    decimals: 8,
    name: 'USDT.u',
  },
  {
    ...measures.USDC,
    chainId: 25,
    address: `${protocolBook.hippo.modules().coins}::DevnetUSDC`,
    decimals: 8,
    name: 'USDC.u',
    symbol: 'USDC',
  },
  {
    ...measures.SOL,
    chainId: 25,
    address: `${protocolBook.hippo.modules().coins}::DevnetSOL`,
    decimals: 8,
    name: 'USDC.u',
    symbol: 'SOL',
  },
  {
    ...measures.BTC,
    chainId: 25,
    address: `${protocolBook.anime.modules().coins}::BTC`,
    decimals: 8,
    name: 'BTC animeswap',
    symbol: 'BTC.a',
  },
  {
    ...measures.ETH,
    chainId: 25,
    address: `${protocolBook.anime.modules().coins}::ETH`,
    decimals: 6,
    name: 'ETH animeswap',
    symbol: 'ETH.a',
  },
  {
    ...measures.USDT,
    chainId: 25,
    address: `${protocolBook.anime.modules().coins}::USDT`,
    decimals: 8,
    name: 'USDT animeswap',
    symbol: 'USDT.a',
  },
  {
    ...measures.USDC,
    chainId: 25,
    address: `${protocolBook.hippo.modules().coins}::USDC`,
    decimals: 8,
    name: 'USDC animeswap',
    symbol: 'USDC.a',
  },
  {
    ...measures.USDT,
    chainId: 25,
    address: `${protocolBook.pontem.modules().coins}::USDT`,
    decimals: 6,
    name: 'Tether:pontem',
    symbol: 'USDT.p',
  },
  {
    chainId: 25,
    address: `${protocolBook.argo.modules().usda}::USDA`,
    decimals: 6,
    name: 'USADA',
    symbol: 'USDA',
    logoURI: 'https://argo.fi/images/favicon.svg',
    extensions: {
      coingeckoId: 'dai',
      yfSymbol: 'DAI-USD',
    }
  },
];
