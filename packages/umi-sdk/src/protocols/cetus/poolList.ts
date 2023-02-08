import Decimal from "decimal.js";
import { getCoinProfileByType } from "../../../../../apps/ui/src/config/coinList";
import { fetchAccountResources, getTypeArgsFromStructTag } from "../../aptos";
import { CoinAmount } from "../../CoinAmount";
import { protocolBook } from "../../protocolList";
import { PoolStatus } from "../../types";
import { curveConstantProduct } from "../../umi/curves";
import { CetusLiquidityPool } from "./types";

export const fetchCetusPools = async (): Promise<PoolStatus[]> => {
  let ownerAccount = protocolBook.cetus.accounts().pool;
  const data = await fetchAccountResources(ownerAccount);

  if (data.isOk()) {
    const pools = data.value
      .filter((d) =>
        d.type.startsWith(`${protocolBook.cetus.structs().Pool as string}<`)
      )
      .flatMap((resource) => {
        const res = resource.data as CetusLiquidityPool;
        const [coinTypeX, coinTypeY] = getTypeArgsFromStructTag(resource.type);

        const coinXInfo = getCoinProfileByType(coinTypeX);
        const coinYInfo = getCoinProfileByType(coinTypeY);

        if (!(coinXInfo && coinYInfo)) return [];

        const coinX = new CoinAmount(coinXInfo, res.coin_a.value);
        const coinY = new CoinAmount(coinYInfo, res.coin_b.value);

        let pool: PoolStatus = {
          protocolName: "cetus",
          resourceType: resource.type,
          ownerAccount,
          pair: {
            name: `${coinX.coinInfo.symbol}-${coinY.coinInfo.symbol}`,
            coinX,
            coinY,
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
  pool: PoolStatus
) => {
  let feeRate = new Decimal(2e-3);

  const [reserveSource, reserveTarget] =
    pool.pair.coinX.coinInfo.type === sourceCoinAmount.coinInfo.type
      ? [pool.pair.coinX, pool.pair.coinY]
      : [pool.pair.coinY, pool.pair.coinX];

  const fee = new CoinAmount(
    sourceCoinAmount.coinInfo,
    sourceCoinAmount.amount.mul(feeRate)
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
