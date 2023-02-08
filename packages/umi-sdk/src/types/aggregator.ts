import type Decimal from 'decimal.js';
import { CoinAmount } from '../CoinAmount';
import type { PoolStatus } from './pool';

export type SwapInfo = {
  fromCoin: CoinAmount;
  toCoin: CoinAmount;
  part: Decimal;
  fee: CoinAmount;
  pool: PoolStatus;
};

// inspired by 1inch
// export type SwapRoute = {
//   amount: Decimal;
//   part: number;
//   subRoutes: SwapInfo[][];
// };

// export type PriceQuote = {
//   fromCoin: CoinProfileWithAmount;
//   toCoin: CoinProfileWithAmount;
//   totalFee: Decimal;
//   routes: SwapRoute[];
// };

export type PriceQuote = {
  fromCoin: CoinAmount;
  toCoin: CoinAmount;
  swapType: 'direct' | 'multi-hop' | 'split';
  swapRoute1: SwapInfo;
  swapRoute2?: SwapInfo; // exists when `swapType` is either multi-hop or split
  swapRoute3?: SwapInfo; // exists when `swapType` is either multi-hop or split
  price: Decimal;
};
