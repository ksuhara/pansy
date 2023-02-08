import { ReactiveMap } from '@solid-primitives/map';
import Decimal from 'decimal.js';
import { createRoot } from 'solid-js';
import type { CoinProfile } from 'src/config/coinList';
import { coinlist } from 'src/config/coinList';
import type { CoinAmount, PoolStatus } from 'umi-sdk';
import { fetchCoinPrices } from 'umi-sdk';

export const createPriceContext = () => {
  const usePriceMap = new ReactiveMap<string, Decimal>();

  const reloadCoinPrices = async () => {
    const prices = await fetchCoinPrices(coinlist());

    prices.forEach(({ coin, price }: { coin: CoinProfile, price: Decimal }) => {
      const coinId = `${coin.network}-${coin.type}`;
      usePriceMap.set(coinId, price);
    });
  };
  reloadCoinPrices();

  const getCoinPrice = (coin: CoinProfile) => {
    const coinId = `${coin.network}-${coin.type}`;
    return usePriceMap.get(coinId) ?? new Decimal(-1);
  };

  const getMktValue = (coin: CoinAmount) => {
    const price = getCoinPrice(coin.coinInfo);
    return coin.amount.mul(price);
  };

  const getPoolBalance = (pool: PoolStatus) => {
    const { coinX, coinY } = pool.pair;
    const valueX = getMktValue(coinX);
    const valueY = getMktValue(coinY);
    const valuePool = valueX.add(valueY);
    return [
      valueX.div(valuePool),
      valueY.div(valuePool),
    ];
  };

  const getPoolImbalance = (pool: PoolStatus) => {
    const balance = getPoolBalance(pool);
    const [ratioX, ratioY] = balance;
    const [minRatio, maxRatio] = ratioX.lt(ratioY)
      ? [ratioX, ratioY]
      : [ratioY, ratioX];

    return new Decimal(1).sub(minRatio.div(maxRatio));
  };

  const getPoolValue = (pool: PoolStatus) => {
    const { coinX, coinY } = pool.pair;
    return coinX.amount.mul(getCoinPrice(coinX.coinInfo)).add(
      coinY.amount.mul(getCoinPrice(coinY.coinInfo))
    );
  };

  return {
    reloadCoinPrices,
    getMktValue,
    getPoolBalance,
    getPoolImbalance,
    getCoinPrice,
    getPoolValue,
    usePriceMap,
  };
};

// DONOT: export const usePriceContext = () => createRoot(createPriceContext)
export const usePriceContext = createRoot(createPriceContext);
