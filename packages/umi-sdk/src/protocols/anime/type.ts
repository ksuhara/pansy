import type { SwapPoolData, SwapPoolResource } from '@animeswap.org/v1-sdk';
import type Decimal from 'decimal.js';
import { PoolInfoFull, PoolStatus } from '../../types';

export type AnimeSwapLiquidityPool = SwapPoolResource;

export type AnimeSwapAdminData = SwapPoolData;

export type AnimeSwapPoolInfoFull = PoolInfoFull & {
  protocolName: 'AnimeSwap',
  extensions: {
    swapFee: Decimal,
  }
};

export type AnimeSwapPoolStatus = PoolStatus & {
  protocolName: 'anime',
  extensions: {
    swapFee: Decimal,
  }
};
