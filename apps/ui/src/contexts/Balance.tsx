import { createContextProvider } from '@solid-primitives/context';
import { createMemo } from 'solid-js';
import type { CoinProfile } from 'src/config/coinList';
import type { CoinAmount } from 'umi-sdk';
import { useAptosBalance } from './AptosBalance';

export const [BalanceProvider, useBalance] = createContextProvider((props) => {

  const { assets: aptosAssets } = useAptosBalance();

  const assets = createMemo(() => [
    ...aptosAssets(),
  ]);

  const findAssetFromCoin = (coin: CoinProfile): CoinAmount | null => {
    const rr = assets().find(asset => asset.coinInfo.type === coin.type);
    return rr;
  };

  const findAssetFromSymbol = (symbol: string): CoinAmount | null => {
    return assets().find(asset => asset.coinInfo.symbol === symbol);
  };

  return {
    assets,
    findAssetFromCoin,
    findAssetFromSymbol,
  };
});
