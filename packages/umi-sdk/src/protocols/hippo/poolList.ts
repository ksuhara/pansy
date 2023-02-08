import Decimal from 'decimal.js';
import { fetchAccountResource } from 'src/config/chain/client';
import { CoinAmount } from 'umi-sdk';
import { protocolBook } from 'umi-sdk/src/protocolList';
import type { PoolInfoFull } from 'umi-sdk/src/types/pool';
import { coinlist, getCoinProfileBySymbol } from '../coinList';
import type { HippoLiquidityPool, HippoPoolInfo } from './types';
import { HippoPoolType } from './types';

type HippoPoolBase = Pick<HippoPoolInfo, 'coinX' | 'coinY' | 'protocolName' | 'poolType'>;
const poolListBase: HippoPoolBase[] = [
  {
    coinX: {
      address: getCoinProfileBySymbol('BTC').type,
    },
    coinY: {
      address: getCoinProfileBySymbol('USDT').type,
    },
    protocolName: protocolBook.hippo.name,
    poolType: HippoPoolType.const_product,
  },
  {
    coinX: {
      address: getCoinProfileBySymbol('BTC').type,
    },
    coinY: {
      address: getCoinProfileBySymbol('USDC').type,
    },
    protocolName: protocolBook.hippo.name,
    poolType: HippoPoolType.const_product,
  },
];

const withResourceType = (pool: HippoPoolBase) => {
  return {
    ...pool,
    lp: {
      address: ''
    },
    address: protocolBook.hippo.accounts.pool,
    protocolName: protocolBook.hippo.name,
    resourceType: `${protocolBook.hippo.modules.cp_swap}::TokenPairMetadata<${pool.coinX.type}, ${pool.coinY.type}>`,
  };
};

const poolList = poolListBase.map(withResourceType);

const fetchPoolInfo = (poolInfo: typeof poolList[0]) => {
  const coinXInfo = coinlist().find(c => c.type === poolInfo.coinX.type);
  const coinYInfo = coinlist().find(c => c.type === poolInfo.coinY.type);

  return fetchAccountResource<HippoLiquidityPool>(poolInfo.type, poolInfo.resourceType)
    .map<PoolInfoFull>(pool => {
      const coinX = new CoinAmount(coinXInfo, pool.balance_x.value);
      const coinY = new CoinAmount(coinYInfo, pool.balance_y.value);

      return {
        ...poolInfo,
        pair: {
          name: `${coinX.coinInfo.symbol}-${coinY.coinInfo.symbol}`,
          coinX,
          coinY,
        },
        liquidity: new Decimal(1e6 * Math.random()),
      };
    });
};

export const fetchHippoPools = () => {
  const results = [...poolList].map(p => fetchPoolInfo(p).unwrapOr<PoolInfoFull>(null));
  return Promise.all<PoolInfoFull>(results);
};
