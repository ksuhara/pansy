import Decimal from "decimal.js";
import {
  CoinProfile,
  getCoinProfileByBinanceSymbol,
} from "../../../../apps/ui/src/config/coinList";

const geckoApiUrl = "https://api.coingecko.com/api/v3/simple/price";

const _fetchCoinPrice = async (coin: CoinProfile) => {
  const coingeckoId = coin?.extensions?.coingeckoId ?? null;

  if (coingeckoId) {
    const url = `${geckoApiUrl}?ids=${coingeckoId}&vs_currencies=usd`;
    const d = await fetch(url).then((r) => r.json());
    return new Decimal(d[coingeckoId]["usd"]);
  }

  return new Decimal(-3);
};

export const fetchBinancePrices = async (coins: CoinProfile[]) => {
  const binanceSymbols = [
    ...new Set(
      coins.map((c) => c.extensions?.binanceSymbol).filter((id) => !!id)
    ),
  ];
  const binanceApiUrl = "https://www.binance.com/api/v3/ticker/price";
  const resourceURL = `${binanceApiUrl}?symbols=[${binanceSymbols
    .map((symbol) => `"${symbol}"`)
    .join(",")}]`;
  const binanceData = (await fetch(encodeURI(resourceURL)).then((r) =>
    r.json()
  )) as { symbol: string; price: string }[];

  const results = binanceData.flatMap(({ symbol: binanceSymbol, price }) => {
    return {
      coin: getCoinProfileByBinanceSymbol(binanceSymbol)!,
      price: new Decimal(price),
    };
  });

  return results;
};

export const fetchGeckoPrices = async (
  coins: CoinProfile[],
  vsGeckoId = "usd"
) => {
  const geckoIds = [
    ...new Set(
      coins.map((c) => c.extensions?.coingeckoId).filter((id) => !!id)
    ),
  ];

  const urlObj = new window.URL(geckoApiUrl);

  urlObj.searchParams.append("ids", geckoIds.join(","));
  urlObj.searchParams.append("vs_currencies", vsGeckoId);

  // e.g. { aptos: { usd: 9.89 }}
  const geckoData = (await fetch(urlObj.href).then((r) => r.json())) as Record<
    string,
    Record<string, number>
  >;

  const results = coins.flatMap((coin) => {
    const geckoPrice = geckoData[coin.extensions?.coingeckoId]?.usd || -1;

    return {
      coin,
      price: new Decimal(geckoPrice),
    };
  });

  return results as { coin: CoinProfile; price: Decimal }[];
};

export const fetchCoinPrices = async (
  coins: CoinProfile[],
  vsGeckoId = "usd"
) => {
  const binancePriceTable = await fetchBinancePrices(coins);
  const geckoPriceTable = await fetchGeckoPrices(coins, vsGeckoId);

  let priceBook: Record<
    string,
    {
      coin: CoinProfile;
      price: Decimal;
      binancePrice?: Decimal;
      geckoPrice?: Decimal;
    }
  > = {};

  geckoPriceTable.forEach(({ coin, price }) => {
    let coinId = `${coin.network}-${coin.symbol}`;
    priceBook[coinId] = { coin, price, geckoPrice: price };
  });

  binancePriceTable.forEach(({ coin, price }) => {
    let coinId = `${coin.network}-${coin.symbol}`;
    priceBook[coinId] = { coin, price, binancePrice: price };
  });

  return Object.values(priceBook);
};
