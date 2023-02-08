import Decimal from "decimal.js";
import { CoinProfile } from "../../../../apps/ui/src/config/coinList";
import { CoinAmount } from "../CoinAmount";
import { PoolStatus } from "../types";

// export const findSwapRoutes = (
//   pools: PoolInfoFull[],
//   coinXAddress: string,
//   coinYAddress: string,
// ) => {
//   const res = pools.filter(pool =>
//     (pool.coinX.type === coinXAddress && pool.coinY.type === coinYAddress)
//     || (pool.coinY.type === coinXAddress && pool.coinX.type === coinYAddress));
//   return res;
// };

export type CalcSwapOutputResult = {
  fees: CoinAmount[];
  outputCoinAmount: CoinAmount;
};

export const calcSwapOutput = (
  sourceCoinAmount: CoinAmount,
  pool: PoolStatus
): CalcSwapOutputResult => {
  const [reserveSource, reserveTarget] =
    pool.pair.coinX.coinInfo.type === sourceCoinAmount.coinInfo.type
      ? [pool.pair.coinX, pool.pair.coinY]
      : [pool.pair.coinY, pool.pair.coinX];

  if (sourceCoinAmount.amount.eq(0)) {
    return {
      fees: [],
      outputCoinAmount: new CoinAmount(reserveTarget.coinInfo, 0),
    };
  }

  return pool.calcOutputAmount(sourceCoinAmount, pool);
};

export const calcAmountTo = (coinFrom: CoinAmount, poolInfo: PoolStatus) => {
  // (x+dx)(y-dy) = k
  // dy = y - x*y / (x+dx)
  let x: Decimal, y: Decimal;
  let coinTo: CoinProfile;
  if (poolInfo.pair.coinX.coinInfo.type === coinFrom.coinInfo.type) {
    x = poolInfo.pair.coinX.amount;
    y = poolInfo.pair.coinY.amount;
    coinTo = poolInfo.pair.coinY.coinInfo;
  } else {
    y = poolInfo.pair.coinX.amount;
    x = poolInfo.pair.coinY.amount;
    coinTo = poolInfo.pair.coinX.coinInfo;
  }

  const dx = coinFrom.amount;
  const k = new Decimal(1);
  const dy = y.minus(x.mul(y).div(x.add(dx)));
  // console.log('calc', {
  //   x: x.toString(),
  //   y: y.toString(),
  //   k: k.toString(),
  //   dx: dx.toString(),
  //   dy: dy.toString(),
  // })
  return new CoinAmount(coinTo, dy);
};

export const calcPrice = (coinFrom: CoinAmount, poolInfo: PoolStatus) => {
  // dy = dx / p
  // p = dx/dy
  return coinFrom.amount.div(calcAmountTo(coinFrom, poolInfo).amount);
};

export const calcTrade = (coinFrom: CoinAmount, poolInfo: PoolStatus) => {
  // dy = dx / p
  // p = dx/dy
  const amountCoinY = calcAmountTo(coinFrom, poolInfo);
  const price = coinFrom.amount.div(amountCoinY.amount);
  return {
    price: price,
    dx: coinFrom.amount,
    dy: amountCoinY,
  };
};

export const calcMinAmount = (coin: CoinAmount, slippageTolerance: number) => {
  const minAmount = coin.amount.mul(1 - slippageTolerance);

  return new CoinAmount(coin.coinInfo, minAmount);
};
