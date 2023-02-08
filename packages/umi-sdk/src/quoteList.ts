import { MultiUndirectedGraph } from "graphology";
import { CoinProfile } from "../../../apps/ui/src/config/coinList";
import { CoinAmount } from "./CoinAmount";
import { PoolStatus } from "./types";
import { getBridgedRouteQuotes, getSplitedRouteQuotes } from "./umi";

export const createPoolGraph = (pools: PoolStatus[]) => {
  const graph = new MultiUndirectedGraph();

  for (const pool of pools) {
    const { coinX, coinY } = pool.pair;

    if (!graph.hasNode(coinX.coinInfo.type))
      graph.addNode(coinX.coinInfo.type, { coin: coinX });
    if (!graph.hasNode(coinY.coinInfo.type))
      graph.addNode(coinY.coinInfo.type, { coin: coinY });

    graph.addEdgeWithKey(
      pool.resourceType,
      coinX.coinInfo.type,
      coinY.coinInfo.type,
      { pool }
    );
  }

  return graph;
};

export const getQuotes = async (
  graph: MultiUndirectedGraph,
  fromCoin: CoinAmount,
  toCoin: CoinProfile,
  maxDepth = 3,
  maxSplit = 1
) => {
  if (!fromCoin.coinInfo.type || !toCoin.type) return [];
  if (!graph.hasNode(fromCoin.coinInfo.type) || !graph.hasNode(toCoin.type))
    return [];
  if (graph.edges().length === 0) return [];

  [
    // ...await getOptimalSplitQuotes(graph, fromCoin, toCoin),
  ];
  const quotes = [
    ...getBridgedRouteQuotes(graph, fromCoin, toCoin, maxDepth),
    ...(maxSplit >= 2 ? getSplitedRouteQuotes(graph, fromCoin, toCoin) : []),
  ];

  return quotes.sort((a, b) => (a.toCoin.amount.gt(b.toCoin.amount) ? -1 : 1));
};
