import { getCoinOutWithFees } from '@animeswap.org/v1-sdk/dist/tsc/modules/SwapModule';
import { CoinAmount } from '../../CoinAmount';
import { CalcOutputAmount } from '../../types';
import { curveConstantProduct } from '../../umi/curves';
import type { AnimeSwapPoolStatus } from './type';

export const _calcAnimeSwapOutput: CalcOutputAmount = (sourceCoinAmount: CoinAmount, pool: AnimeSwapPoolStatus) => {
  const feeRate = pool.extensions.swapFee

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
  )

  return {
    outputCoinAmount: new CoinAmount(reserveTarget.coinInfo, outputAmount),
    fees: [fee],
  };
};

export const calcAnimeSwapOutput: CalcOutputAmount = (sourceCoin: CoinAmount, pool: AnimeSwapPoolStatus) => {
  const [reserveIn, reserveOut] = pool.pair.coinX.coinInfo.type === sourceCoin.coinInfo.type
    ? [pool.pair.coinX, pool.pair.coinY]
    : [pool.pair.coinY, pool.pair.coinX];

  const sourceCoinAmount = sourceCoin.amount.mul(10 ** sourceCoin.coinInfo.decimals);
  const targetCoinAmount = getCoinOutWithFees(
    sourceCoinAmount,
    reserveIn.amount.mul(10 ** reserveIn.coinInfo.decimals),
    reserveOut.amount.mul(10 ** reserveOut.coinInfo.decimals),
    pool.extensions.swapFee,
  );

  // anime swap takes a fee from source coin
  const feeAmount = sourceCoinAmount.mul(pool.extensions.swapFee.div(10000));
  const fee = new CoinAmount(sourceCoin.coinInfo, feeAmount);

  const outputCoinAmount = new CoinAmount(reserveOut.coinInfo, targetCoinAmount.toNumber());

  return {
    outputCoinAmount,
    fees: [fee],
  };
};
