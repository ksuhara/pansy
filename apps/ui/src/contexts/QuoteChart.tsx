import { createContextProvider } from '@solid-primitives/context';
import { debounce } from '@solid-primitives/scheduled';
import { createEffect, createSignal } from 'solid-js';
import type { CoinProfile } from 'src/config/coinList';
import { fetchQuote_vs_USD, fetchQuote_X_vs_Y } from 'src/config/priceList';
import type { QuoteForChart } from 'umi-sdk';
import { useTradeContext } from './tradeContext';

export const [QuoteChartProvider, useQuoteChart] = createContextProvider(() => {
  const { sortedPair } = useTradeContext();
  const [quote, _setQuote] = createSignal<QuoteForChart[]>([]);
  const setQuote = debounce(
    (quote: QuoteForChart[]) => { _setQuote(quote); },
    250
  );
  const [coinX, setCoinX] = createSignal<CoinProfile | null>(null);
  const [coinY, setCoinY] = createSignal<CoinProfile | null>(null);

  createEffect(() => {
    setCoinX(sortedPair()[0] ?? null);
    setCoinY(sortedPair()[1] ?? null);
  });

  const fetchSeries = async () => {
    if (coinX() && coinY() && coinX().symbol !== coinY().symbol) {
      const quote = await fetchQuote_X_vs_Y(coinX(), coinY());
      setQuote(quote);
    } else if (coinX()) {
      const quote = await fetchQuote_vs_USD(coinX());
      setQuote(quote);
    }
  };

  createEffect(fetchSeries);

  return {
    sortedPair,
    quote, setQuote,
    coinX, coinY,
    setCoinX, setCoinY,
  };
});
