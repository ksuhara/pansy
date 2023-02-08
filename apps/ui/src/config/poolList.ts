import { getMoveObjectType, getObjectFields, getObjectId, JsonRpcProvider } from '@mysten/sui.js';
import Decimal from 'decimal.js';
import type { CalcOutputAmount, PoolStatus } from 'umi-sdk';
import {
  CoinAmount, curveConstantProduct, fetchAnimeSwapPools,
  fetchAptoswapnetPools,
  fetchAuxPools,
  fetchCetusPools, fetchObricPools, fetchPancakePools, fetchPontemPools, getTypeArgsFromStructTag
} from 'umi-sdk';
import { poolObjectIdBook } from './addressList';
import { coinlist } from './coinList';

export const fetchAptosPools = () => Promise
  .all([
    fetchPontemPools(),
    fetchAnimeSwapPools(),
    fetchAuxPools(),
    fetchCetusPools(),
    fetchPancakePools(),
    fetchAptoswapnetPools(),
    fetchObricPools(),
  ])
  .then(p => p.flat())
  // ignore null
  .then(p => p.filter(pp => !!pp));

export const fetchSuiPools = () => Promise
  .all([
    fetchUdoswapPools(),
    fetchUmaswapPools(),
  ])
  .then(p => p.flat())
  // ignore null
  .then(p => p.filter(pp => !!pp));

const fetchUdoswapPools = async () => {
  const suiClient = new JsonRpcProvider('https://fullnode.devnet.sui.io');
  const resources = await suiClient.getObjectBatch([
    poolObjectIdBook.udoswap.BTC_USDC,
    poolObjectIdBook.udoswap.USDT_USDC,
    poolObjectIdBook.udoswap.ETH_USDC,
  ]);

  const pools = resources.map(r => {
    const [coinTypeX, coinTypeY] = getTypeArgsFromStructTag(getMoveObjectType(r));
    const coinProfileX = coinlist().find(coin => coin.network === 'SuiDevnet' && coin.type === coinTypeX);
    const coinProfileY = coinlist().find(coin => coin.network === 'SuiDevnet' && coin.type === coinTypeY);

    const fields = getObjectFields(r);
    const pool: PoolStatus = {
      chain: 'sui',
      protocolName: 'udoswap',
      resourceType: getMoveObjectType(r),
      objectId: getObjectId(r),
      ownerAddress: getObjectId(r),
      pair: {
        name: `${coinProfileX.symbol}-${coinProfileY.symbol}`,
        coinX: new CoinAmount(coinProfileX, fields.reserve_x),
        coinY: new CoinAmount(coinProfileY, fields.reserve_y),
      },
      calcOutputAmount: calcSwapOutput
    };
    return pool;
  });
  return pools;
};

const fetchUmaswapPools = async () => {
  const suiClient = new JsonRpcProvider('https://fullnode.devnet.sui.io');
  const resources = await suiClient.getObjectBatch([
    poolObjectIdBook.umaswap.BTC_USDC,
  ]);

  const pools = resources.map(r => {
    const [coinTypeX, coinTypeY] = getTypeArgsFromStructTag(getMoveObjectType(r));
    const coinProfileX = coinlist().find(coin => coin.network === 'SuiDevnet' && coin.type === coinTypeX);
    const coinProfileY = coinlist().find(coin => coin.network === 'SuiDevnet' && coin.type === coinTypeY);

    const fields = getObjectFields(r);
    const pool: PoolStatus = {
      chain: 'sui',
      protocolName: 'umaswap',
      resourceType: getMoveObjectType(r),
      objectId: getObjectId(r),
      ownerAddress: getObjectId(r),
      pair: {
        name: `${coinProfileX.symbol}-${coinProfileY.symbol}`,
        coinX: new CoinAmount(coinProfileX, fields.reserve_x),
        coinY: new CoinAmount(coinProfileY, fields.reserve_y),
      },
      calcOutputAmount: calcSwapOutput
    };
    return pool;
  });
  return pools;
};

const calcSwapOutput: CalcOutputAmount = (sourceCoinAmount: CoinAmount, pool: PoolStatus) => {
  const feeRate = new Decimal(3e-3);

  const [reserveSource, reserveTarget] = pool.pair.coinX.coinInfo.type === sourceCoinAmount.coinInfo.type
    ? [pool.pair.coinX, pool.pair.coinY]
    : [pool.pair.coinY, pool.pair.coinX];

  // if (curveType.endsWith('Uncorrelated')) {
  const fee = new CoinAmount(sourceCoinAmount.coinInfo, sourceCoinAmount.amount.mul(feeRate));
  const sourceCoinSubsFees = sourceCoinAmount.amount.sub(fee.amount);

  const outputAmount = curveConstantProduct(
    sourceCoinSubsFees,
    reserveSource.amount,
    reserveTarget.amount,
  );

  return {
    outputCoinAmount: new CoinAmount(reserveTarget.coinInfo, outputAmount),
    fees: [fee],
  };
};
