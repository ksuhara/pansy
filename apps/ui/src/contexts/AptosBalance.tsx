import { createContextProvider } from '@solid-primitives/context';
import type { MaybeHexString } from 'aptos';
import { createEffect, createSignal } from 'solid-js';
import type { CoinProfile } from 'src/config/coinList';
import { coinlist } from 'src/config/coinList';
import { CoinAmount, fetchAccountResources } from 'umi-sdk';
import { usePriceContext } from './Price';
import { useAptosWallet } from './WalletProvider';

export const fetchAssets = async (
  accountAddress: MaybeHexString,
  coinlist: CoinProfile[],
): Promise<CoinAmount[]> => {
  const resources = await fetchAccountResources(accountAddress).unwrapOr([]);

  const balances = coinlist.flatMap(coin => {
    const coinStoreType = `0x1::coin::CoinStore<${coin.type}>`;
    const resource = resources.find(r => r.type === coinStoreType);

    if (!resource) return [];
    return new CoinAmount(coin, resource.data.coin.value);
  });

  return balances;
};

export const [AptosBalanceProvider, useAptosBalance] = createContextProvider((props) => {
  const { connected, account } = useAptosWallet();

  const [assets, setAssets] = createSignal<CoinAmount[]>([]);
  const { getCoinPrice, reloadCoinPrices } = usePriceContext;

  const fetchBalance = async () => {
    console.log('fetch aptos balance');
    if (account()) {
      await reloadCoinPrices();
      const coinAmountList = await fetchAssets(
        (account().address ?? account().publicKey) as string, coinlist());
      const balances = coinAmountList
        .filter(asset => asset.amount.gt(0));

      setAssets(balances);
    } else {
      setAssets([]);
    }
  };

  const findAssetFromCoin = (coin: CoinProfile): CoinAmount | null => {
    return assets().find(asset => asset.coinInfo.type === coin.type);
  };

  const findAssetFromSymbol = (symbol: string): CoinAmount | null => {
    return assets().find(asset => asset.coinInfo.symbol === symbol);
  };

  createEffect(fetchBalance);
  return {
    assets,
    fetchBalance,
    findAssetFromCoin,
    findAssetFromSymbol,
  };
});
