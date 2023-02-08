import { obric } from "@manahippo/hippo-sdk";
import { U128 } from "@manahippo/move-to-ts";
import Decimal from "decimal.js";
import { getCoinProfileByType } from "../../../../../apps/ui/src/config/coinList";
import { fetchAccountResources, getTypeArgsFromStructTag } from "../../aptos";
import { CoinAmount } from "../../CoinAmount";
import { CalcOutputAmount, PoolStatus } from "../../types";
import { ObricLiquidityPool, ObricPoolStatus } from "./types";

export const fetchObricPools = async (): Promise<PoolStatus[]> => {
  let ownerAccount =
    "0xc7ea756470f72ae761b7986e4ed6fd409aad183b1b2d3d2f674d979852f45c4b";
  const data = await fetchAccountResources(ownerAccount);
  const poolType =
    "0xc7ea756470f72ae761b7986e4ed6fd409aad183b1b2d3d2f674d979852f45c4b::piece_swap::PieceSwapPoolInfo";

  console.log("data", data);
  if (data.isOk()) {
    const pools = data.value
      .filter((d) => d.type.startsWith(poolType))
      .flatMap((resource) => {
        const data = resource.data as ObricLiquidityPool;

        const [coinTypeX, coinTypeY] = getTypeArgsFromStructTag(resource.type);

        const coinXInfo = getCoinProfileByType(coinTypeX);
        const coinYInfo = getCoinProfileByType(coinTypeY);

        if (!(coinXInfo && coinYInfo)) return [];

        const coinX = new CoinAmount(coinXInfo, data.reserve_x.value);
        const coinY = new CoinAmount(coinYInfo, data.reserve_y.value);

        let pool: ObricPoolStatus = {
          protocolName: "obric",
          resourceType: resource.type,
          ownerAccount,
          pair: {
            name: `${coinX.coinInfo.symbol}-${coinY.coinInfo.symbol}`,
            coinX,
            coinY,
          },
          calcOutputAmount: calcSwapOutput,
          extensions: {
            config: {
              x_deci_mult: data.x_deci_mult,
              y_deci_mult: data.y_deci_mult,
              K: data.K,
              K2: data.K2,
              Xa: data.Xa,
              Xb: data.Xb,
              m: data.m,
              n: data.n,
              swap_fee_per_million: data.swap_fee_per_million,
            },
          },
        };
        return pool;
      });

    return pools;
  }
};

const calcSwapOutput: CalcOutputAmount = (
  sourceCoinAmount: CoinAmount,
  pool: ObricPoolStatus
) => {
  const [reserveSource, reserveTarget] =
    pool.pair.coinX.coinInfo.type === sourceCoinAmount.coinInfo.type
      ? [pool.pair.coinX, pool.pair.coinY]
      : [pool.pair.coinY, pool.pair.coinX];

  try {
    const [s_deci_mult, t_deci_mult] =
      pool.pair.coinX.coinInfo.type === sourceCoinAmount.coinInfo.type
        ? [
            pool.extensions.config.x_deci_mult,
            pool.extensions.config.y_deci_mult,
          ]
        : [
            pool.extensions.config.y_deci_mult,
            pool.extensions.config.x_deci_mult,
          ];

    const feeRate = new Decimal(
      pool.extensions.config.swap_fee_per_million
    ).div(1e6);

    const output: U128 = obric.Piece_swap_math.get_swap_x_to_y_out_(
      new U128(reserveSource.toU64).mul(new U128(s_deci_mult)),
      new U128(reserveTarget.toU64).mul(new U128(t_deci_mult)),
      new U128(sourceCoinAmount.toU64).mul(new U128(s_deci_mult)),
      new U128(pool.extensions.config.K),
      new U128(pool.extensions.config.K2),
      new U128(pool.extensions.config.Xa),
      new U128(pool.extensions.config.Xb),
      new U128(pool.extensions.config.m),
      new U128(pool.extensions.config.n),
      null
    );

    const outputAmount = new Decimal(
      output.div(new U128(t_deci_mult)).toBigInt().toString()
    ).div(10 ** reserveTarget.coinInfo.decimals);

    const fee = outputAmount.mul(feeRate);

    return {
      outputCoinAmount: new CoinAmount(
        reserveTarget.coinInfo,
        outputAmount.sub(fee)
      ),
      fees: [new CoinAmount(reserveTarget.coinInfo, fee)],
    };
  } catch {
    // console.log("Obric ERROR")
    // console.log(sourceCoinAmount, pool)
    return {
      outputCoinAmount: new CoinAmount(reserveTarget.coinInfo, 0),
      fees: [],
    };
  }
};
