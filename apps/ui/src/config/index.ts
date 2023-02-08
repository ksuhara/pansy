// // 20 secs
// export const priceFetchInterval = 20e3;

import { useWindowSize } from '@solid-primitives/resize-observer';
import { CoinAmount } from 'umi-sdk';
import { coinlist } from './coinList';
import type { NetworkName } from './networkList';

export const priceFetchInterval = 300e3;

export { version } from '../../../../package.json';

export type Network = 'Mainnet' | 'Testnet' | 'Devnet';

export const isDevelopment = () => window.location.hostname !== 'umi.ag';

const windowSize = useWindowSize();
export const isMobileWidth = () => windowSize.width <= 680;

export const profileDemoAddress = '0x26f51d6be165dd192f98ee959002bf208b2dabcd6e051c19f19009c8809df742';

const initialAptosTradingPairSymbols = {
  source: 'APT',
  target: 'USDC',
};

const initialSuiTradingPairSymbol = {
  source: 'BTC',
  target: 'USDC',
};

export const freqCoinList = [
  'APT',
  'USDT',
  'USDC',
  'WBTC',
  'WETH',
  'WBNB',
];

export const trendingPairList = [
  { coinX: 'APT', coinY: 'USDC' },
  { coinX: 'APT', coinY: 'zUSDC' },
  { coinX: 'USDC', coinY: 'WETH' },
  { coinX: 'SOL', coinY: 'USDC' },
  { coinX: 'USDC', coinY: 'USDCso' },
  { coinX: 'APT', coinY: 'tAPT' },
  // { coinX: 'WETH', coinY: 'zUSDC' },
  // { coinX: 'APT', coinY: 'zUSDT' },
];

export const trendingArbList = [
  'APT',
  'USDC',
  'zUSDC',
  'ceUSDC',
];

const initialAptosTradingPair = (networkName: NetworkName) => {
  return {
    source: (() => {
      const coin = coinlist().find(coin => coin.network === networkName && coin.symbol === initialAptosTradingPairSymbols.source);
      return new CoinAmount(coin, 10 ** coin.decimals);
    })(),
    target: (() => {
      const coin = coinlist().find(coin => coin.network === networkName && coin.symbol === initialAptosTradingPairSymbols.target);
      return new CoinAmount(coin, 0);
    })(),
  };
};

const initialSuiTradingPair = (networkName: NetworkName) => {
  return {
    source: (() => {
      const coin = coinlist().find(coin => coin.network === networkName && coin.symbol === initialSuiTradingPairSymbol.source);
      return new CoinAmount(coin, 10 ** coin.decimals);
    })(),
    target: (() => {
      const coin = coinlist().find(coin => coin.network === networkName && coin.symbol === initialSuiTradingPairSymbol.target);
      return new CoinAmount(coin, 0);
    })(),
  };
};

export const initialTradingPair = (networkName: NetworkName): {
  source: CoinAmount
  target: CoinAmount
} => {
  if (networkName === 'AptosMainnet') {
    return initialAptosTradingPair(networkName);
  } else if (networkName === 'SuiDevnet') {
    return initialSuiTradingPair(networkName);
  }
};
