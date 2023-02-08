import Decimal from "decimal.js";
import { getCoinProfileByType } from "../../../../../apps/ui/src/config/coinList";
import { fetchAccountResources, getTypeArgsFromStructTag } from "../../aptos";
import { CoinAmount } from "../../CoinAmount";
import { protocolBook } from "../../protocolList";
import { PoolStatus } from "../../types";
import { curveConstantProduct } from "../../umi/curves";
import { AuxLiquidityPool, AuxLiquidityPoolStatus } from "./types";

export const fetchAuxPools = async (): Promise<PoolStatus[]> => {
  let ownerAccount = protocolBook.aux.accounts().pool;
  const data = await fetchAccountResources(ownerAccount);
  if (data.isOk()) {
    const pools = data.value
      .filter((d) =>
        d.type.startsWith(protocolBook.aux.structs().Pool as string)
      )
      .flatMap((resource) => {
        const res = resource.data as AuxLiquidityPool;
        const [coinTypeX, coinTypeY] = getTypeArgsFromStructTag(resource.type);

        const coinXInfo = getCoinProfileByType(coinTypeX);
        const coinYInfo = getCoinProfileByType(coinTypeY);

        if (!(coinXInfo && coinYInfo)) return [];

        const coinX = new CoinAmount(coinXInfo, res.x_reserve.value);
        const coinY = new CoinAmount(coinYInfo, res.y_reserve.value);

        let pool: AuxLiquidityPoolStatus = {
          protocolName: "aux",
          resourceType: resource.type,
          ownerAccount,
          pair: {
            name: `${coinX.coinInfo.symbol}-${coinY.coinInfo.symbol}`,
            coinX,
            coinY,
          },
          extensions: {
            feeRate: new Decimal(res.fee_bps).div(1e4),
          },
          calcOutputAmount: calcSwapOutput,
        };
        return pool;
      });

    return pools;
  }
};

const calcSwapOutput: CalcOutputAmount = (
  sourceCoinAmount: CoinAmount,
  pool: AuxLiquidityPoolStatus
) => {
  const [reserveSource, reserveTarget] =
    pool.pair.coinX.coinInfo.type === sourceCoinAmount.coinInfo.type
      ? [pool.pair.coinX, pool.pair.coinY]
      : [pool.pair.coinY, pool.pair.coinX];

  const fee = new CoinAmount(
    sourceCoinAmount.coinInfo,
    sourceCoinAmount.amount.mul(pool.extensions.feeRate)
  );
  const sourceCoinSubsFees = sourceCoinAmount.amount.sub(fee.amount);

  const outputAmount = curveConstantProduct(
    sourceCoinSubsFees,
    reserveSource.amount,
    reserveTarget.amount
  );

  return {
    outputCoinAmount: new CoinAmount(reserveTarget.coinInfo, outputAmount),
    fees: [fee],
  };
};
