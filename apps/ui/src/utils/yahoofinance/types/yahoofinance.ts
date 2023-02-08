
export interface QuoteForChart {
  x: Date,
  y: number[]
}

// export const validRanges = = ['1d', '1w', '1M', '3M', '6M', '1y'] as const
// export type Range = typeof ranges[number]

export type ValidRange =
  | '1d'
  | '5d'
  | '1mo'
  | '3mo'
  | '6mo'
  | '1y'
  | '2y'
  | '5y'
  | '10y'
  | 'ytd'
  | 'max';

export const validRanges: ValidRange[] = [
  '1d',
  '5d',
  '1mo',
  '3mo',
  '6mo',
  '1y',
  '2y',
  '5y',
];

export type ValidInterval =
  | '1m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '1d'
  | '3mo'
  | '6mo'
  | '1y'
  | '2y'
  | '5y'
  | '10y'
  | 'ytd'
  | 'max';

export interface RangeOptionValue {
  range: string
  interval: string
}

export const RangeOptions: Record<
'1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y',
RangeOptionValue
> = {
  '1d': {
    range: '1d',
    interval: '5m',
  }, // 47
  '5d': {
    range: '5d',
    interval: '30m',
  }, // 60
  '1mo': {
    range: '1mo',
    interval: '1h',
  }, // 162
  '3mo': {
    range: '3mo',
    interval: '1d',
  }, // 63
  '6mo': {
    range: '6mo',
    interval: '1d',
  }, // 125
  '1y': {
    range: '1y',
    interval: '5d',
  }, // 51
  '2y': {
    range: '2y',
    interval: '5d',
  }, // 104
  '5y': {
    range: '5y',
    interval: '1mo',
  }, // 61
};

export interface PriceQuoteResult {
  error: string
  spark: {
    result: {
      symbol: string
      response: PriceQuote[]
    }
  }
}

export interface PriceQuote {
  meta: {
    currency: string
    symbol: string
    exchangeName: string
    instrumentType: string
    firstTradeDate: number
    regularMarketTime: number
    gmtoffset: number
    timezone: string
    exchangeTimezoneName: string
    regularMarketPrice: number
    chartPreviousClose: number
    previousClose: number
    scale: number
    priceHint: number
    currentTradingPeriod: {
      pre: {
        timezone: string
        start: number
        end: number
        gmtoffset: number
      }
      regular: {
        timezone: string
        start: number
        end: number
        gmtoffset: number
      }
      post: {
        timezone: string
        start: number
        end: number
        gmtoffset: number
      }
    }
    tradingPeriods: [
      [
        {
          timezone: string
          start: number
          end: number
          gmtoffset: number
        },
      ],
    ]
    dataGranularity: string
    range: ValidRange
    validRanges: ValidRange[]
  }
  timestamp: number[]
  indicators: {
    quote: [{ close: number[] }]
  }
}

export interface QuoteReponse {
  quoteResponse: {
    result: QuoteSummary[]
    error: null
  }
}

export interface QuoteSummary {
  language: 'en-US'
  region: 'US'
  quoteType: string
  typeDisp: string
  quoteSourceName: string
  triggerable: true
  customPriceAlertConfidence: string
  currency: string
  exchange: string
  longName: string
  esgPopulated: boolean
  messageBoardId: string
  gmtOffSetMilliseconds: number
  shortName: string
  exchangeTimezoneName: string
  market: string
  firstTradeDateMilliseconds: number
  priceHint: number
  regularMarketChange: number
  regularMarketChangePercent: number
  regularMarketTime: number
  regularMarketPrice: number
  regularMarketDayHigh: number
  regularMarketDayRange: string
  regularMarketDayLow: number
  regularMarketVolume: number
  regularMarketPreviousClose: number
  bid: number
  ask: number
  bidSize: number
  askSize: number
  fullExchangeName: string
  financialCurrency: string
  regularMarketOpen: number
  averageDailyVolume3Month: number
  averageDailyVolume10Day: number
  fiftyTwoWeekLowChange: number
  fiftyTwoWeekLowChangePercent: number
  fiftyTwoWeekRange: string
  fiftyTwoWeekHighChange: number
  fiftyTwoWeekHighChangePercent: number
  fiftyTwoWeekLow: number
  fiftyTwoWeekHigh: number
  trailingAnnualDividendRate: number
  trailingPE: number
  trailingAnnualDividendYield: number
  epsTrailingTwelveMonths: number
  epsForward: number
  epsCurrentYear: number
  priceEpsCurrentYear: number
  sharesOutstanding: number
  bookValue: number
  fiftyDayAverage: number
  fiftyDayAverageChange: number
  fiftyDayAverageChangePercent: number
  twoHundredDayAverage: number
  twoHundredDayAverageChange: number
  twoHundredDayAverageChangePercent: number
  marketCap: number
  forwardPE: number
  priceToBook: number
  sourceInterval: number
  exchangeDataDelayedBy: number
  pageViewGrowthWeekly: number
  averageAnalystRating: string
  tradeable: false
  exchangeTimezoneShortName: string
  marketState: string
  displayName: string
  symbol: string
}
