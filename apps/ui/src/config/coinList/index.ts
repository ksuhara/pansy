
import { DEFAULT_MAINNET_LIST } from '@manahippo/coin-list';
import { coinlist as suiCoinList } from '@umi-ag/sui-coin-list';
import type { ChainName, NetworkName } from 'src/config/networkList';
import { biancneBook } from './binanceBook';
import { coinOrder } from './common';
import { geckoBook } from './geckoBook';
import { logoBook } from './logoBook';
import { yfBook } from './yfbook';

type CoinProfileBase = {
  name: string
  network: NetworkName
  chain: ChainName
  symbol: string
  officialSymbol: string
  decimals: number
  logoURI: string
  type: string
  extensions: {
    binanceSymbol?: string
    coingeckoId?: string
    description?: string
    discord?: string
    facebook?: string
    instagram?: string
    medium?: string
    reddit?: string
    telegram?: string
    twitter?: string
    website?: string
    yahoofinaceSymbol?: string
  }
};

type SuiCoinProfile = CoinProfileBase & {
  chain: 'sui'
  objects: {
    package: string
    type: string
    module: string
    objectName: string
    TreasuryCap?: string
  }
};

export type CoinProfile = CoinProfileBase | SuiCoinProfile;

export const coinListAptosMainnet = DEFAULT_MAINNET_LIST.map(coin => {
  return {
    network: 'AptosMainnet',
    chain: 'aptos',
    type: coin.token_type.type,
    decimals: coin.decimals,
    name: coin.name,
    symbol: coin.symbol,
    officialSymbol: coin.official_symbol,
    logoURI: logoBook[coin.symbol] ?? coin.logo_url,
    extensions: {
      website: coin.project_url,
      binanceSymbol: biancneBook[coin.official_symbol],
      coingeckoId: geckoBook[coin.official_symbol] ?? coin.coingecko_id,
      yahoofinaceSymbol: yfBook[coin.official_symbol],
    }
  } satisfies CoinProfile;
});

export const coinListSuiDevnet = suiCoinList.map(coin => {
  return {
    ...coin,
    network: 'SuiDevnet',
    chain: 'sui',
  } satisfies CoinProfile;
});

export const coinlist = (): CoinProfile[] => [
  ...coinListAptosMainnet,
  ...coinListSuiDevnet,
];

export const sortPair = (coinX: CoinProfile, coinY: CoinProfile) => {
  return [coinX, coinY].sort((a, b) => coinOrder.indexOf(a.symbol) - coinOrder.indexOf(b.symbol));
};

export const getCoinProfileBySymbol = (symbol: string) => {
  return coinlist().find(coin => coin.symbol === symbol);
};

export const getCoinProfileByType = (coinType: string) => {
  return coinlist().find(coin => coin.type === coinType);
};

export const getCoinProfileByBinanceSymbol = (binanceSymbol: string) => {
  return coinlist().find(coin => coin?.extensions?.binanceSymbol === binanceSymbol);
};
