import { resampleOhlcv } from 'ohlc-resample';
import type { PriceQuoteResult, QuoteForChart, ValidInterval, ValidRange } from './types/yahoofinance';

export const fetchPriceQuote = async ({
  symbol,
  range,
  interval,
}: {
  symbol: string
  range: ValidRange
  interval: ValidInterval

}) => {
  const r = await fetch(`/api/quote/${symbol}/${range}/${interval}`);
  const data: { data: PriceQuoteResult } = await r.json();
  return data;
};

export const qutoeDivQuote = (
  quoteX: number[],
  quoteY: number[],
) => {
  return quoteX.map((_, i) => {
    const priceX = quoteX[i];
    const priceY = quoteY[i];
    return priceX / priceY;
  });
};

export const fetchOHLCQuote = async ({ symbol, symbolY, range, interval }: {
  symbol: string
  symbolY?: string
  range: ValidRange
  interval: ValidInterval
}): Promise<QuoteForChart[]> => {
  const quote = await fetchPriceQuote({ symbol, range, interval });
  const timestamps = quote.data.spark.result[0].response[0].timestamp;
  let prices = [];
  const pricesX = quote.data.spark.result[0].response[0].indicators.quote[0].close;

  if (symbolY) {
    const quoteY = await fetchPriceQuote({ symbol: symbolY, range, interval });
    const pricesY = quoteY.data.spark.result[0].response[0].indicators.quote[0].close;
    prices = qutoeDivQuote(pricesX, pricesY);
  } else {
    prices = pricesX;
  }

  const raw_quote = timestamps.map((timestamp, i) => {
    const time = timestamps[i] * 1000;
    const price = prices[i];
    return {
      time,
      close: price,
      open: price,
      high: price,
      low: price,
      volume: 0,
    };
  });
  const baseTimeframe = (timestamps.slice(-2)[0] - timestamps.slice(-3)[0]);
  const newTimeframe = baseTimeframe * 5;
  console.log(baseTimeframe, newTimeframe);
  const data: QuoteForChart[] = resampleOhlcv(raw_quote, {
    baseTimeframe,
    newTimeframe
  }).map(
    // @ts-ignore
    ({ time, open, high, low, close }) => ({
      x: new Date(time),
      y: [open, high, low, close]
    })
  );
  return data;
};
