import { liquidswap } from '@manahippo/hippo-sdk';
import type { Types } from 'aptos';
import { CoinAmount } from '../../CoinAmount';
import { CalcOutputAmount } from '../../types';
import { curveConstantProduct } from '../../umi/curves';
import type { LiquidswapPoolStatus } from './type';

export const swapTransactionPayload = (
  coinFrom: CoinAmount,
  coinTo: CoinAmount,
  lpAddress: string,
) => {
  const payload: Types.TransactionPayload =
  {
    'function': '0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9::scripts::swap',
    'type_arguments': [
      coinFrom.coinInfo.type,
      coinTo.coinInfo.type,
      lpAddress,
    ],
    'arguments': [
      '0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9',
      coinFrom.amount.mul(10 ** coinFrom.coinInfo.decimals).round().toString(),
      coinTo.amount
        .mul(0.9)
        .mul(10 ** coinTo.coinInfo.decimals).round().toString(),
    ],
    'type': 'entry_function_payload'
  };
  return payload;
};

const feeScale = liquidswap.Liquidity_pool.FEE_SCALE.toJsNumber();

export const calcLiquidswapOutput: CalcOutputAmount = (sourceCoinAmount: CoinAmount, pool: LiquidswapPoolStatus) => {
  const { pair, extensions: { curveType } } = pool;
  const feeRate = pool.extensions.fee / feeScale;

  const [reserveSource, reserveTarget] = pool.pair.coinX.coinInfo.type === sourceCoinAmount.coinInfo.type
    ? [pool.pair.coinX, pool.pair.coinY]
    : [pool.pair.coinY, pool.pair.coinX]

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
