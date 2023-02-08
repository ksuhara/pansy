import type { TypeTagString } from '@manahippo/move-to-ts';
import { createContextProvider } from '@solid-primitives/context';
import type Decimal from 'decimal.js';
import { MultiUndirectedGraph } from 'graphology';
import { createEffect, createMemo, createSignal } from 'solid-js';
import { fetchAptosPools, fetchSuiPools } from 'src/config/poolList';
import type { PoolStatus } from 'umi-sdk';
import { useNetwork } from './Network';

const DEFAULT_RELOAD_INTERVAL = 20 * 1000; // 20 sec

type LPBook = Record<TypeTagString, { totalSupply: Decimal }>;

const createPoolGraph = (pools: PoolStatus[]) => {
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
      { pool },
    );
  }

  return graph;
};

export const [PoolProvider, usePools] = createContextProvider(() => {
  const { networkName } = useNetwork();

  const [pools, setPools] = createSignal<PoolStatus[]>([]);
  const [loading, setLoading] = createSignal(false);
  const [dateLastReload, setDateLastReload] = createSignal(Date.now());
  const [interval] = createSignal(DEFAULT_RELOAD_INTERVAL);
  const graph = createMemo(() => createPoolGraph(pools()));

  const refetchAptosPools = async () => {
    const pools = await fetchAptosPools();
    setPools(pools);
  };

  const refetchSuiPools = async () => {
    const pools = await fetchSuiPools();
    setPools(pools);
  };

  const reloadPools = async () => {
    setLoading(true);
    if (networkName() === 'AptosMainnet') {
      refetchAptosPools();
    } else
    if (networkName() === 'SuiDevnet') {
      refetchSuiPools();
    }
    setLoading(false);

    const date = new Date();
    setDateLastReload(date.getTime());
  };
  createEffect(reloadPools);

  window.setInterval(() => {
    const timespent = Date.now() - dateLastReload() + 1000;
    if (timespent < interval()) return;

    reloadPools();
  }, interval());

  const findPoolByType = (resourceType: TypeTagString) => {
    return pools().find(pool => pool.resourceType === resourceType);
  };

  const findPools = (coinXAddress: string, coinYAddress: string) => {
    if (!graph().hasNode(coinXAddress) || !graph().hasNode(coinYAddress)) return [];
    return graph()
      .edges(coinXAddress, coinYAddress)
      .map(poolAddress => graph().getEdgeAttribute(poolAddress, 'pool'));
  };

  return {
    pools,
    dateLastReload,
    reloadPools,
    isPoolLoading: loading,
    reloadInterval: interval,
    poolGraph: graph,
    findPools,
    findPoolByType,
  };
});
