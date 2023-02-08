import Decimal from "decimal.js";
import { getCoinProfileByType } from "../../../../../apps/ui/src/config/coinList";
import { fetchAccountResources, getTypeArgsFromStructTag } from "../../aptos";
import { CoinAmount } from "../../CoinAmount";
import { protocolBook } from "../../protocolList";
import { calcAnimeSwapOutput } from "./swap";
import {
  AnimeSwapAdminData,
  AnimeSwapLiquidityPool,
  AnimeSwapPoolStatus,
} from "./type";

export const fetchAnimeSwapPools = async (): Promise<AnimeSwapPoolStatus[]> => {
  let ownerAccount = protocolBook.anime.accounts().pool;
  const data = await fetchAccountResources(ownerAccount);

  if (data.isOk()) {
    const adminData = data.value.find(
      (resource) =>
        resource.type === `${protocolBook.anime.modules().pool}::AdminData`
    )?.data as AnimeSwapAdminData;

    const swapFee = adminData?.swap_fee || 30;

    const pools = data.value
      .filter((d) =>
        d.type.startsWith(protocolBook.anime.structs().LiquidityPool)
      )
      .flatMap((resource) => {
        const res = resource.data as AnimeSwapLiquidityPool;
        const [coinTypeX, coinTypeY] = getTypeArgsFromStructTag(resource.type);

        const coinXInfo = getCoinProfileByType(coinTypeX);
        const coinYInfo = getCoinProfileByType(coinTypeY);

        if (!(coinXInfo && coinYInfo)) return [];

        // In mainnet values are in coin_x/y_reserve.value,
        // but in testnet values are in coin_x/y_reserve (not in .value)
        const coinXReserve =
          typeof res.coin_x_reserve === "object"
            ? res.coin_x_reserve.value
            : res.coin_x_reserve;
        const coinYReserve =
          typeof res.coin_y_reserve === "object"
            ? res.coin_y_reserve.value
            : res.coin_y_reserve;

        const coinX = new CoinAmount(coinXInfo, coinXReserve);
        const coinY = new CoinAmount(coinYInfo, coinYReserve);

        let pool: AnimeSwapPoolStatus = {
          protocolName: "anime",
          resourceType: resource.type,
          ownerAccount,
          pair: {
            name: `${coinX.coinInfo.symbol}-${coinY.coinInfo.symbol}`,
            coinX,
            coinY,
          },
          extensions: {
            swapFee: new Decimal(swapFee),
          },
          calcOutputAmount: calcAnimeSwapOutput,
        };
        return pool;
      });
    return pools;
  }
};
