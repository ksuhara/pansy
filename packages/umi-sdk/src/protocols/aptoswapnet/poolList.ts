import Decimal from "decimal.js";
import { getCoinProfileByType } from "../../../../../apps/ui/src/config/coinList";
import { fetchAccountResources, getTypeArgsFromStructTag } from "../../aptos";
import { CoinAmount } from "../../CoinAmount";
import { protocolBook } from "../../protocolList";
import { calcAptoswapnetOutput } from "./swap";
import type { AptoswapnetPool, AptoswapnetPoolStatus } from "./types";

// type PartialPoolInfo = Pick<
//   AptoswapnetPool,
//   ''
//   // 'address' | 'coinX' | 'coinY' | 'curveType' | 'protocolName'
// >;

export const fetchAptoswapnetPools = async (): Promise<
  AptoswapnetPoolStatus[]
> => {
  let ownerAccount = protocolBook.aptoswapnet.accounts().exchange;

  const data = await fetchAccountResources(ownerAccount);
  if (data.isOk()) {
    const pools = data.value
      .filter((d) => d.type.startsWith(protocolBook.aptoswapnet.structs().Pool))
      .flatMap((resource) => {
        const res = resource.data as AptoswapnetPool;
        const [coinTypeX, coinTypeY] = getTypeArgsFromStructTag(resource.type);

        const coinXInfo = getCoinProfileByType(coinTypeX);
        const coinYInfo = getCoinProfileByType(coinTypeY);

        if (!(coinXInfo && coinYInfo)) return [];

        const coinX = new CoinAmount(coinXInfo, res.x.value);
        const coinY = new CoinAmount(coinYInfo, res.y.value);

        const pool: AptoswapnetPoolStatus = {
          protocolName: "aptoswapnet",
          resourceType: resource.type,
          ownerAccount,
          pair: {
            name: `${coinX.coinInfo.symbol}-${coinY.coinInfo.symbol}`,
            coinX,
            coinY,
          },
          extensions: {
            fee_direction: res.fee_direction === 200 ? "x" : "y",
            admin_fee: new Decimal(res.admin_fee),
            connect_fee: new Decimal(res.connect_fee),
            incentive_fee: new Decimal(res.incentive_fee),
            lp_fee: new Decimal(res.lp_fee),
          },
          calcOutputAmount: calcAptoswapnetOutput,
        };
        return pool;
      });

    return pools;
  }
};
