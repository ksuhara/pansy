import {
  getCoinProfileBySymbol,
  getCoinProfileByType,
} from "../../../../../apps/ui/src/config/coinList";
import {
  fetchAccountResource,
  fetchAccountResources,
  getTypeArgsFromStructTag,
} from "../../aptos";
import { CoinAmount } from "../../CoinAmount";
import { protocolBook } from "../../protocolList";
import { calcLiquidswapOutput } from "./curve";
import type {
  LiquidswapPoolInfo,
  PontemLiqudityPool,
  PontemPoolStatus,
} from "./type";

export const fetchPontemPools = async (): Promise<PontemPoolStatus[]> => {
  const coinPairs = [
    {
      coinX: getCoinProfileBySymbol("USDC"),
      coinY: getCoinProfileBySymbol("APT"),
      curve: protocolBook.pontem.structs().Uncorrelated,
    },
    {
      coinX: getCoinProfileBySymbol("USDT"),
      coinY: getCoinProfileBySymbol("APT"),
      curve: protocolBook.pontem.structs().Uncorrelated,
    },
    {
      coinX: getCoinProfileBySymbol("zUSDC"),
      coinY: getCoinProfileBySymbol("APT"),
      curve: protocolBook.pontem.structs().Uncorrelated,
    },
    {
      coinX: getCoinProfileBySymbol("zUSDT"),
      coinY: getCoinProfileBySymbol("APT"),
      curve: protocolBook.pontem.structs().Uncorrelated,
    },
    {
      coinX: getCoinProfileBySymbol("WETH"),
      coinY: getCoinProfileBySymbol("APT"),
      curve: protocolBook.pontem.structs().Uncorrelated,
    },
    {
      coinX: getCoinProfileBySymbol("zWETH"),
      coinY: getCoinProfileBySymbol("APT"),
      curve: protocolBook.pontem.structs().Uncorrelated,
    },
    {
      coinX: getCoinProfileBySymbol("DLC"),
      coinY: getCoinProfileBySymbol("APT"),
      curve: protocolBook.pontem.structs().Uncorrelated,
    },
    // { coinX: getCoinProfileBySymbol('SOL'), coinY: getCoinProfileBySymbol('APT'), curve: protocolBook.pontem.structs().Uncorrelated },
  ];

  let ownerAccount = protocolBook.pontem.accounts().pool;

  const promiseList = coinPairs.flatMap(async ({ coinX, coinY, curve }) => {
    const resourceType = `${protocolBook.pontem.structs().LiquidityPool}<${
      coinX.type
    }, ${coinY.type}, ${curve}>`;
    const r = await fetchAccountResource(ownerAccount, resourceType);
    return r.isOk()
      ? {
          type: resourceType,
          data: r.value,
        }
      : [];
  });
  const results = await Promise.all(promiseList);
  const pools = (results as { type: string; data: unknown }[])
    .flatMap((resource) => {
      const res = resource.data as PontemLiqudityPool;
      const [coinTypeX, coinTypeY, curveType] = getTypeArgsFromStructTag(
        resource.type
      );

      const coinXInfo = getCoinProfileByType(coinTypeX);
      const coinYInfo = getCoinProfileByType(coinTypeY);

      if (!(coinXInfo && coinYInfo)) return [];

      const coinX = new CoinAmount(coinXInfo, res.coin_x_reserve.value);
      const coinY = new CoinAmount(coinYInfo, res.coin_y_reserve.value);

      let pool: PontemPoolStatus = {
        protocolName: "pontem",
        resourceType: resource.type,
        ownerAccount,
        pair: {
          name: `${coinX.coinInfo.symbol}-${coinY.coinInfo.symbol}`,
          coinX,
          coinY,
        },
        calcOutputAmount: calcLiquidswapOutput,
        extensions: {
          curveType,
          fee: Number(res.fee),
        },
      };
      return pool;
    })
    .filter((pool) => pool.extensions.curveType.endsWith("Uncorrelated"));
  return pools;
};

export const _fetchPontemPools = async (): Promise<LiquidswapPoolInfo[]> => {
  const data = await fetchAccountResources(protocolBook.pontem.accounts().pool);
  if (data.isOk()) {
    const pools = data.value
      .filter((d) =>
        d.type.startsWith(protocolBook.pontem.structs().LiquidityPool)
      )
      .flatMap((resource) => {
        const res = resource.data as PontemLiqudityPool;
        const [coinTypeX, coinTypeY, curveType] = getTypeArgsFromStructTag(
          resource.type
        );

        const coinXInfo = getCoinProfileByType(coinTypeX);
        const coinYInfo = getCoinProfileByType(coinTypeY);

        if (!(coinXInfo && coinYInfo)) return [];

        const coinX = new CoinAmount(coinXInfo, res.coin_x_reserve.value);
        const coinY = new CoinAmount(coinYInfo, res.coin_y_reserve.value);

        return {
          protocolName: protocolBook.pontem.name,
          resourceType: resource.type,
          pair: {
            name: `${coinX.coinInfo.symbol}-${coinY.coinInfo.symbol}`,
            coinX,
            coinY,
          },
          extensions: {
            curveType,
            fee: Number(res.fee),
          },
        };
      })
      .filter((pool) => pool.extensions.curveType.endsWith("Uncorrelated"));
    return pools;
  }
};
