import { fetchOHLCQuote } from '../utils/yahoofinance';
import type { CoinProfile } from './coinList';

export const fetchQuote_vs_USD = async (
  coinX: CoinProfile,
) => {
  const range = '5d';
  const interval = '15m';
  const yfSymbol = coinX.extensions?.yahoofinaceSymbol ?? null;

  if (yfSymbol) {
    const quote = await fetchOHLCQuote({ symbol: yfSymbol, range, interval });
    return quote;
  }

  return [];
};

export const fetchQuote_X_vs_Y = async (
  coinX: CoinProfile,
  coinY: CoinProfile,
) => {

  const range = '5d';
  const interval = '15m';
  const xSymbol = coinX.extensions?.yahoofinaceSymbol ?? null;
  const ySymbol = coinY.extensions?.yahoofinaceSymbol ?? null;

  if (xSymbol && ySymbol) {
    const quote = await fetchOHLCQuote({ symbol: xSymbol, symbolY: ySymbol, range, interval });
    return quote;
  }

  return [];
};
