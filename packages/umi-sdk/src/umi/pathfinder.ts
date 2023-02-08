import Decimal from "decimal.js";
import type { MultiUndirectedGraph } from "graphology";
import { CoinProfile } from "../../../../apps/ui/src/config/coinList";
import { CoinAmount } from "../CoinAmount";
import { PoolStatus, PriceQuote, SwapInfo } from "../types";

type Path = {
  from: CoinAmount;
  to: CoinAmount;
  pool: PoolStatus;
};

export const findBridgedRoutes = (
  graph: MultiUndirectedGraph,
  fromCoin: CoinAmount,
  toCoin: CoinProfile,
  maxDepth: number
) => {
  const routes: Path[][] = [];

  const dfs = (coin: string, currentRoute: Path[] = [], depth = 1) => {
    graph
      .edges(coin, toCoin.type)
      .map(
        (lp) =>
          ({
            from: graph.getNodeAttribute(coin, "coin"),
            to: graph.getNodeAttribute(toCoin.type, "coin"),
            pool: graph.getEdgeAttribute(lp, "pool"),
          } as Path)
      )
      .forEach((r) => routes.push([...currentRoute, r]));

    if (depth + 1 > maxDepth) return;
    graph
      .neighbors(coin)
      .flatMap((neighborCoin) =>
        graph.edges(coin, neighborCoin).map(
          (lp) =>
            ({
              from: graph.getNodeAttribute(coin, "coin"),
              to: graph.getNodeAttribute(neighborCoin, "coin"),
              pool: graph.getEdgeAttribute(lp, "pool"),
            } as Path)
        )
      )
      // TODO: check if paths are not duplicated
      .forEach((r) => dfs(r.to.coinInfo.type, [...currentRoute, r], depth + 1));
  };

  dfs(fromCoin.coinInfo.type);

  return routes;
};

export const bridgesToPriceQuote = (
  fromCoin: CoinAmount,
  points: Path[]
): PriceQuote => {
  const subRoute = points.reduce<SwapInfo[]>((prev, cur, i) => {
    const from = i === 0 ? fromCoin : prev[i - 1].toCoin;
    let res = cur.pool.calcOutputAmount(from, cur.pool);
    if (res) {
      const { outputCoinAmount, fees } = res;

      prev.push({
        fromCoin: from,
        toCoin: outputCoinAmount,
        fee: fees[0],
        part: new Decimal(1),
        pool: cur.pool,
      });
    }

    return prev;
  }, []);

  const to = subRoute[subRoute.length - 1].toCoin;

  return {
    fromCoin,
    toCoin: to,
    swapType: subRoute.length >= 2 ? "multi-hop" : "direct",
    swapRoute1: subRoute[0],
    swapRoute2: subRoute[1],
    swapRoute3: subRoute[2],
    price: fromCoin.amount.div(to.amount),
  };
};

export const getBridgedRouteQuotes = (
  graph: MultiUndirectedGraph,
  fromCoin: CoinAmount,
  toCoin: CoinProfile,
  maxDepth: number
) => {
  return findBridgedRoutes(graph, fromCoin, toCoin, maxDepth).map((r) =>
    bridgesToPriceQuote(fromCoin, r)
  );
};

// TODO: need to be kaizen
export const getSplitedRouteQuotes = (
  graph: MultiUndirectedGraph,
  fromCoin: CoinAmount,
  toCoin: CoinProfile
) => {
  const pools: Path[] = graph
    .edges(fromCoin.coinInfo.type, toCoin.type)
    .map((lp) => ({
      from: graph.getNodeAttribute(fromCoin.coinInfo.type, "coin"),
      to: graph.getNodeAttribute(toCoin.type, "coin"),
      pool: graph.getEdgeAttribute(lp, "pool"),
    }));

  if (fromCoin.amount.eq(0)) return [];
  if (pools.length < 2) return [];

  const amountsPerPool = pools.map(({ from, pool }) => {
    return (
      [...new Array(19).keys()]
        // 5, 10, ..., 95% of amount
        .map((n) => fromCoin.amount.div(20).mul(n + 1))
        .map((amount, i) => {
          const { outputCoinAmount, fees } = pool.calcOutputAmount(
            new CoinAmount(from.coinInfo, amount),
            pool
          );

          return {
            fromCoin: new CoinAmount(from.coinInfo, amount),
            toCoin: outputCoinAmount,
            part: new Decimal(((i + 1) * 5) / 100),
            fee: fees[0],
            pool,
          } as {
            fromCoin: CoinAmount;
            toCoin: CoinAmount;
            part: Decimal;
            fee: CoinAmount;
            pool: PoolStatus;
          };
        })
    );
  });

  type PoolWithAmount = typeof amountsPerPool[0][0];
  // sort in descending order
  // const comparePrice = (a: PoolWithAmount, b: PoolWithAmount) => {
  //   const pa = a.toCoin.amount.div(a.fromCoin.amount);
  //   const pb = b.toCoin.amount.div(b.fromCoin.amount);
  //   return pa.gt(pb) ? -1 : 1;
  // };

  // const sorted = amountsPerPool.map(pools => [...pools].sort(comparePrice));
  const sorted = amountsPerPool;
  // console.log('sorted', sorted.map(ss => ss.map(s => ({
  //   price: s.toCoin.amount.div(s.fromCoin.amount).toNumber(),
  //   part: s.part,
  //   toa: s.toCoin.amount.toNumber(),
  //   froma: s.fromCoin.amount.toNumber(),
  // }))));

  const bestPricePairs = sorted.flatMap((poolA, poolIndex) =>
    sorted.slice(poolIndex + 1).map((poolB) => {
      const pairs: PoolWithAmount[][] = [...new Array(19).keys()]
        .map((i) => {
          const j = 18 - i;
          return [poolA[i], poolB[j]];
        })
        .sort((a, b) => {
          const toA = a[0].toCoin.amount.add(a[1].toCoin.amount);
          const toB = b[0].toCoin.amount.add(b[1].toCoin.amount);

          return toA.gt(toB) ? -1 : 1;
        });

      // console.log(
      //   poolA[0].pool.protocolName,
      //   poolB[0].pool.protocolName,
      //   pairs.map(pair => ({
      //     toAmo: pair[0].toCoin.amount.add(pair[1].toCoin.amount).toNumber(),
      //     price: pair[0].toCoin.amount.add(pair[1].toCoin.amount).div(fromCoin.amount).toNumber(),
      //     part: `${pair[0].part} + ${pair[1].part}`,
      //   })),
      // );
      const bestPricePair = pairs[0];
      return bestPricePair;
    })
  );

  // console.log('best', bestPricePairs);
  const toQuote = ([route1, route2]: typeof bestPricePairs[0]): PriceQuote => {
    const toCoinAmount = route1.toCoin.amount.add(route2.toCoin.amount);

    return {
      fromCoin,
      toCoin: new CoinAmount(toCoin, toCoinAmount),
      swapType: "split",
      swapRoute1: route1,
      swapRoute2: route2,
      price: fromCoin.amount.div(toCoinAmount),
    };
  };

  return bestPricePairs
    .map(toQuote)
    .sort((a, b) => (a.toCoin.amount.gt(b.toCoin.amount) ? -1 : 1))
    .filter((_, i) => i < 10);
};
