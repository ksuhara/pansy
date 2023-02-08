import type { MultiUndirectedGraph } from 'graphology';
// import type { PriceQuote } from 'src/utils/yahoofinance/types/yahoofinance';
import type { PoolStatus, PriceQuote } from 'umi-sdk';
import { SwapStep, getBridgedRouteQuotes, getSplitedRouteQuotes, getWeghtComboList } from 'umi-sdk';
import type { CoinAmount } from 'umi-sdk/src/CoinAmount';
import type { CoinProfile } from './coinList';

type Path = {
  from: CoinAmount,
  to: CoinAmount,
  pool: PoolStatus,
};

export const twoSplitWeightList: number[][] = getWeghtComboList(2, 20);
export const threeSplitWeightList: number[][] = getWeghtComboList(3, 20);

const getTwoSplitQuotes = async (
  graph: MultiUndirectedGraph,
  sourceCoinAmount: CoinAmount,
  targetCoin: CoinProfile,
  n_split: number,
): Promise<PriceQuote[]> => {
  const pools: Path[] = graph
    .edges(sourceCoinAmount.coinInfo.type, targetCoin.type)
    .map(lp => ({
      from: graph.getNodeAttribute(sourceCoinAmount.coinInfo.type, 'coin'),
      to: graph.getNodeAttribute(targetCoin.type, 'coin'),
      pool: graph.getEdgeAttribute(lp, 'pool'),
    }));

  if (sourceCoinAmount.amount.eq(0)) return [];
  if (pools.length < 2) return [];

  const swapStep = new SwapStep(
    sourceCoinAmount.coinInfo,
    targetCoin,
    pools.map(({ pool }) => pool),
    twoSplitWeightList,
    n_split,
  );

  await swapStep.fit(sourceCoinAmount);
  const quote = await swapStep.toQuote(sourceCoinAmount);
  return [quote];
};

const getThreeSplitQuotes = async (
  graph: MultiUndirectedGraph,
  sourceCoinAmount: CoinAmount,
  targetCoin: CoinProfile,
  n_split: number,
): Promise<PriceQuote[]> => {
  const pools: Path[] = graph
    .edges(sourceCoinAmount.coinInfo.type, targetCoin.type)
    .map(lp => ({
      from: graph.getNodeAttribute(sourceCoinAmount.coinInfo.type, 'coin'),
      to: graph.getNodeAttribute(targetCoin.type, 'coin'),
      pool: graph.getEdgeAttribute(lp, 'pool'),
    }));

  if (sourceCoinAmount.amount.eq(0)) return [];
  if (pools.length < 2) return [];

  const swapStep = new SwapStep(
    sourceCoinAmount.coinInfo,
    targetCoin,
    pools.map(({ pool }) => pool),
    threeSplitWeightList,
    n_split,
  );

  await swapStep.fit(sourceCoinAmount);
  const quote = await swapStep.toQuote(sourceCoinAmount);
  return [quote];
};

export const maxDepthForAptos = 3;
export const maxDepthForSui = 3;

export const aptosGetQuotes = async (
  graph: MultiUndirectedGraph,
  sourceCoinAmount: CoinAmount,
  targetCoin: CoinProfile,
  maxDepth = 3,
  maxSplit = 1,
) => {

  if (!sourceCoinAmount.coinInfo.type || !targetCoin.type) return [];
  if (!graph.hasNode(sourceCoinAmount.coinInfo.type) || !graph.hasNode(targetCoin.type)) return [];
  if (graph.edges().length === 0) return [];

  [
    // ...await getOptimalSplitQuotes(graph, sourceCoinAmount, targetCoin, 4),
  ];

  const quotes: PriceQuote[] = [
    ...await getThreeSplitQuotes(graph, sourceCoinAmount, targetCoin, 3),
    ...getBridgedRouteQuotes(graph, sourceCoinAmount, targetCoin, maxDepth),
    ...(maxSplit >= 2 ? getSplitedRouteQuotes(graph, sourceCoinAmount, targetCoin) : []),
  ];

  return quotes
    .sort((a, b) => a.toCoin.amount.gt(b.toCoin.amount) ? -1 : 1);
};

export const suiGetQuotes = async (
  graph: MultiUndirectedGraph,
  sourceCoinAmount: CoinAmount,
  targetCoin: CoinProfile,
  maxDepth = 3,
  maxSplit = 1,
) => {

  if (!sourceCoinAmount.coinInfo.type || !targetCoin.type) return [];
  if (!graph.hasNode(sourceCoinAmount.coinInfo.type) || !graph.hasNode(targetCoin.type)) return [];
  if (graph.edges().length === 0) return [];

  [
    // ...await getOptimalSplitQuotes(graph, sourceCoinAmount, targetCoin, 4),
  ];

  const quotes: PriceQuote[] = [
    ...await getTwoSplitQuotes(graph, sourceCoinAmount, targetCoin, 2),
    ...await getThreeSplitQuotes(graph, sourceCoinAmount, targetCoin, 3),
    ...getBridgedRouteQuotes(graph, sourceCoinAmount, targetCoin, maxDepth),
    ...(maxSplit >= 2 ? getSplitedRouteQuotes(graph, sourceCoinAmount, targetCoin) : []),
  ]

  const condition = (q: PriceQuote): boolean => {
    if (q.swapRoute1 && (typeof q.swapRoute2) === 'undefined')  {
      return true;
    }
    else if (q.swapRoute2 && (typeof q.swapRoute3) === 'undefined' && q.swapRoute1.pool.objectId !== q.swapRoute2.pool.objectId) {
      return true;
    }
    else if (q.swapRoute3) {
      if (q.swapRoute1.pool.objectId !== q.swapRoute2.pool.objectId && q.swapRoute1.pool.objectId !== q.swapRoute3.pool.objectId && q.swapRoute2.pool.objectId !== q.swapRoute3.pool.objectId) {
        return true;
      }
    }
  }

  return quotes
    .filter((r) => condition(r))
    .sort((a, b) => a.toCoin.amount.gt(b.toCoin.amount) ? -1 : 1);
};
