import { createContextProvider } from '@solid-primitives/context';
import { debounce } from '@solid-primitives/scheduled';
import { createStorageSignal } from '@solid-primitives/storage';
import { createPolled } from '@solid-primitives/timer';
import type { Types } from 'aptos';
import Decimal from 'decimal.js';
import Fuse from 'fuse.js';
import { createEffect, createMemo, createSignal } from 'solid-js';
import type { CoinProfile } from 'src/config/coinList';
import { getCoinProfileByType, sortPair } from 'src/config/coinList';
import { aptosGetQuotes, maxDepthForAptos, maxDepthForSui, suiGetQuotes } from 'src/config/quoteList';
import { Asset } from 'src/types/asset';
import { safeJsonParse, safeJsonStringify } from 'src/utils/safe-json';
import { makeSuiSwapPayload } from 'src/utils/umiSui';
import { match } from 'ts-pattern';
import type { PoolStatus, PriceQuote, SwapSettings } from 'umi-sdk';
import { calcTrade, CoinAmount, makeSwapPayload } from 'umi-sdk';
import { initialTradingPair, priceFetchInterval } from '../config';
import { useBalance } from './Balance';
import { useNetwork } from './Network';
import { usePools } from './Pool';
import { usePriceContext } from './Price';
import { useSuiBalance } from './SuiBalance';

export const [TradeContextProvider, useTradeContext] = createContextProvider(props => {
  const { findAssetFromCoin } = useBalance();
  const { pools, poolGraph, findPools } = usePools();
  const [price, setPrice] = createSignal(new Decimal(0));
  const [poolInfo, setPoolInfo] = createSignal<PoolStatus | null>(null);
  const { getCoinPrice, reloadCoinPrices } = usePriceContext;

  const { networkName } = useNetwork();

  const [tradingPair, setTradingPair] = createSignal<{
    source: CoinAmount
    target: CoinAmount
  }>(initialTradingPair(networkName()));

  createEffect(() => {
    setTradingPair(initialTradingPair(networkName()));
  });

  const sourceCoinAmount = createMemo(() => tradingPair().source);
  const targetCoinAmount = createMemo(() => tradingPair().target);

  const setSourceCoinAmount = (coin: CoinAmount) => {
    setTradingPair(prev => {
      return {
        ...prev,
        source: coin,
      };
    });
  };

  const setTargetCoinAmount = (coin: CoinAmount) => {
    setTradingPair(prev => {
      return {
        ...prev,
        target: coin,
      };
    });
  };

  const setFromAmount = (amount: Decimal) => {
    setTradingPair(prev => ({
      ...prev,
      source: new CoinAmount(prev.source.coinInfo, amount)
    }));
  };

  const setToAmount = (amount: Decimal) => {
    setTradingPair(prev => ({
      ...prev,
      target: new CoinAmount(prev.target.coinInfo, amount)
    }));
  };

  const tradableCoinList = createMemo(() => {
    const coinSet = new Set(pools().flatMap(pool => [
      pool.pair.coinX.coinInfo.type,
      pool.pair.coinY.coinInfo.type,
    ]));
    const coinList: CoinProfile[] = Array.from(coinSet)
      .map(coinType => getCoinProfileByType(coinType));
    return coinList;
  });

  const coinListFuse = createMemo(() => {
    const fuse = new Fuse<CoinProfile>(tradableCoinList(), {
      keys: ['symbol', 'name', 'type', 'extensions.coingeckoId'],
    });

    return fuse;
  });

  const searchCoins = (text: string) => coinListFuse()
    ?.search(text)
    .map(result => result.item) || [];

  createEffect(async () => {
    const routes = findPools(
      sourceCoinAmount().coinInfo.type,
      targetCoinAmount().coinInfo.type,
    );
    setPoolInfo(routes[0]);
  });

  const [pairFound, setPairFound] = createSignal(true);
  const [quotes, setQuotes] = createSignal<PriceQuote[]>([]);
  const [coinToAmount, setTargetCoinAmountAmount] = createSignal(new Decimal(0));
  const [selectedQuote, selectQuote] = createSignal<PriceQuote>(null);
  const { networkProfile } = useNetwork();

  createEffect(async () => {
    // console.time();


    let priceQuotes: PriceQuote[] = [];

    if (networkProfile().chain === 'aptos') {
      priceQuotes = await aptosGetQuotes(
        poolGraph(), sourceCoinAmount(), targetCoinAmount().coinInfo,
        maxDepthForAptos,
      )
    } else
    if (networkProfile().chain === 'sui') {
      priceQuotes = await suiGetQuotes(
        poolGraph(), sourceCoinAmount(), targetCoinAmount().coinInfo,
        maxDepthForSui,
      )
    }

    setQuotes(priceQuotes);
    setPairFound(priceQuotes.length > 0);
    if (priceQuotes.length > 0) {
      setTargetCoinAmountAmount(
        priceQuotes[0].toCoin.truncatedAmount
      );
      selectQuote(priceQuotes[0]);
    }

    // console.log(priceQuotes.map(rr => ({
    //   from: rr.fromCoin.address,
    //   fromAmount: rr.fromCoin.amount.toNumber(),
    //   to: rr.toCoin.address,
    //   toAmount: rr.toCoin.amount.toNumber(),
    //   fee: rr.totalFee.toNumber(),
    //   routes: [rr.swapRoute1, rr.swapRoute2],
    // })));
  });

  const date = createPolled(() => new Date(), priceFetchInterval);

  const onChangeFromAmount = (fromAmount: Decimal) => {
    setFromAmount(fromAmount);
    // const { price, dy } = calcTrade(sourceCoinAmount(), poolInfo());
    // setPrice(price);
    // setToAmount(dy);
  };

  const onChangeToAmount = (toAmount: Decimal) => {
    setToAmount(toAmount);
    const { price, dy } = calcTrade(targetCoinAmount(), poolInfo());
    setPrice(price);
    setFromAmount(dy.amount);
  };

  const reverseCoinSourceTarget = () => {

    setTradingPair(prev => {
      const y = new CoinAmount(
        targetCoinAmount().coinInfo,
        selectedQuote()?.toCoin.truncatedAmount ?? 0
      );
      return {
        source: y,
        target: prev.source,
      };
    });
  };

  const sourceAsset = createMemo(() => {
    const holdingSourceCoinAmount = findAssetFromCoin(sourceCoinAmount().coinInfo);
    if (holdingSourceCoinAmount) {
      return new Asset({
        name: holdingSourceCoinAmount.coinInfo.name,
        amount: holdingSourceCoinAmount.amount,
        price: getCoinPrice(holdingSourceCoinAmount.coinInfo),
        logoURI: holdingSourceCoinAmount.coinInfo.logoURI,
        info: {
          protocol: 'wallet'
        },
      });
    } else {
      return null;
    }
  });

  const targetAsset = createMemo(() => {
    const holdingTargetCoinAmount = findAssetFromCoin(targetCoinAmount().coinInfo);
    if (holdingTargetCoinAmount) {
      return new Asset({
        name: holdingTargetCoinAmount.coinInfo.name,
        amount: holdingTargetCoinAmount.amount,
        price: getCoinPrice(holdingTargetCoinAmount.coinInfo),
        logoURI: holdingTargetCoinAmount.coinInfo.logoURI,
        info: {
          protocol: 'wallet'
        },
      });
    } else {
      return null;
    }
  });

  // const pairs = pools().map(p => p.pair);
  // createEffect(() => {
  //   setPairFound(pairs.some(p =>
  //     (p.coinX.address === sourceCoinAmount().address && p.coinY.address === targetCoinAmount().address)
  //     || (p.coinY.address === sourceCoinAmount().address && p.coinX.address === targetCoinAmount().address)
  //   ));
  // });

  const [sortedPair, setSortedPair] = createSignal<CoinProfile[]>([]);
  const trigger = debounce(
    // @ts-ignore
    (coins: CoinProfile) => { setSortedPair(coins); },
    250
  );

  createEffect(() => {
    const next = sortPair(sourceCoinAmount().coinInfo, targetCoinAmount().coinInfo);
    // @ts-ignore
    trigger(next);
  });

  const initialSwapSettings = {
    maxGasFee: 40_000,
    slippageTolerance: 0.01,
    transactionDeadline: 30,
  };
  const [swapSettings, setSwapSettings] = createStorageSignal<SwapSettings>(
    'swap-settings',
    initialSwapSettings,
    {
      serializer: (value) => safeJsonStringify(value).unwrapOr(undefined),
      deserializer: (value) => safeJsonParse(value).unwrapOr(initialSwapSettings),
    }
  );

  const { getTradableCoinObjects } = useSuiBalance();
  const selectedQuotePayload = async () => match(networkProfile().chain)
    .with('aptos', () => {
      return makeSwapPayload(selectedQuote(), swapSettings());
    })
    .with('sui', async () => {
      const coins_s = await getTradableCoinObjects(selectedQuote().fromCoin);
      return makeSuiSwapPayload(selectedQuote(), swapSettings(), coins_s);
    })
    .exhaustive();

  const [selectedQuoteSimulatedResult, setSelectedQuoteSimulatedResult] = createSignal<Types.UserTransaction | null>(null);

  createEffect(async () => {
    // const payload = selectedQuotePayload();
    // if (payload.isOk()) {
    //   const res = await simulatePayload(payload.value);
    //   setSelectedQuoteSimulatedResult(res);
    // } else {
    //   setSelectedQuoteSimulatedResult(null);
    // }
  });

  return {
    date,
    price,
    setFromAmount,
    setToAmount,
    onChangeFromAmount,
    onChangeToAmount,
    poolInfo,
    sourceCoinAmount, targetCoinAmount,
    setSourceCoinAmount, setTargetCoinAmount,
    setTradingPair,
    reverseCoinSourceTarget,
    sourceAsset,
    targetAsset,
    pairFound,
    quotes,
    coinToAmount,
    selectedQuote,
    selectQuote,
    sortedPair,
    swapSettings,
    setSwapSettings,
    tradableCoinList,
    searchCoins,
    poolGraph,
    selectedQuotePayload,
    selectedQuoteSimulatedResult,
  };
});
