import Decimal from 'decimal.js';
import { CoinAmount } from '../../CoinAmount';
import { CalcOutputAmount } from '../../types';
import type { CalcSwapOutputResult } from '../../umi/calculator';
import { curveConstantProduct } from '../../umi/curves';
import type { AptoswapnetPoolStatus } from './types';

const calcTradeAmount = ({
  deltaX,
  reserveX,
  reserveY,
  feeDirection,
  totalAdminFee,
  totalLpFee,
}: {
  deltaX: Decimal,
  reserveX: Decimal,
  reserveY: Decimal,
  feeDirection: 'x' | 'y',
  totalAdminFee: Decimal,
  totalLpFee: Decimal,
}): {
  deltaY: Decimal,
  feeX: Decimal
  feeY: Decimal
} => {
  const zeroReturn = {
    deltaY: new Decimal(0),
    feeX: new Decimal(0),
    feeY: new Decimal(0),
  };

  let deltaY = new Decimal(0);
  let feeX = new Decimal(0);
  let feeY = new Decimal(0);

  if (feeDirection === 'x') {
    feeX = deltaX.sub(totalAdminFee);
    deltaX = deltaX.mul(new Decimal(1).sub(totalAdminFee));
  }
  feeX = feeX.add(deltaX.mul(totalLpFee));
  deltaX = deltaX.mul(new Decimal(1).sub(totalLpFee));

  if (deltaX.isNeg()) {
    return zeroReturn;
  }

  deltaY = curveConstantProduct(deltaX, reserveX, reserveY);

  if (feeDirection === 'y') {
    feeY = deltaY.sub(totalAdminFee);
    deltaY = deltaY.mul(new Decimal(1).sub(totalAdminFee));
  }
  if (deltaY.isNeg()) {
    return zeroReturn;
  }

  return { deltaY, feeX, feeY };
};

export const calcAptoswapnetOutput: CalcOutputAmount = (
  sourceCoinAmount: CoinAmount,
  pool: AptoswapnetPoolStatus,
): CalcSwapOutputResult => {
  const BPS_SCALING = 10_000;
  const [reserveSource, reserveTarget] = pool.pair.coinX.coinInfo.type === sourceCoinAmount.coinInfo.type
    ? [pool.pair.coinX, pool.pair.coinY]
    : [pool.pair.coinY, pool.pair.coinX];

  const totalAdminFee = pool.extensions.admin_fee.add(pool.extensions.connect_fee).div(BPS_SCALING);
  const totalLpFee = pool.extensions.incentive_fee.add(pool.extensions.lp_fee).div(BPS_SCALING);

  let deltaX = sourceCoinAmount.amount
  const { deltaY, feeX, feeY } = calcTradeAmount({
    // deltaX: sourceCoinAmount.amount,
    deltaX,
    reserveX: reserveSource.amount,
    reserveY: reserveTarget.amount,
    feeDirection: pool.extensions.fee_direction,
    totalAdminFee,
    totalLpFee,
  });

  return {
    outputCoinAmount: new CoinAmount(reserveTarget.coinInfo, deltaY),
    fees: [
      new CoinAmount(reserveSource.coinInfo, feeX),
      new CoinAmount(reserveTarget.coinInfo, feeY),
    ],
    // TODO: Add feeY
  };
};
