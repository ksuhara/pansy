import type { MoveResource } from 'aptos/src/generated';
import { coinlist } from 'src/config/coinList';
import { usePriceContext } from 'src/contexts/Price';
import { Asset } from 'src/types/asset';
import { CoinAmount } from 'umi-sdk';

export const parseAptosWalletAssetList = (accountResources: MoveResource[]): Asset[] => {
  const { getCoinPrice } = usePriceContext;

  const coinAmountList: CoinAmount[] = coinlist().flatMap(coin => {
    const coinStoreType = `0x1::coin::CoinStore<${coin.type}>`;
    const resource = accountResources.find(r => r.type === coinStoreType);
    if (!resource) return [];
    return new CoinAmount(coin, resource.data.coin.value);
  });

  const assets = coinAmountList
    .filter(asset => asset.amount.gt(0))
    .map((coin) => {
      const price = getCoinPrice(coin.coinInfo);
      const asset = new Asset({
        name: coin.coinInfo.symbol,
        amount: coin.amount,
        price,
        logoURI: coin.coinInfo.logoURI,
        coinProfile: coin.coinInfo,
        info: {
          protocol: 'wallet'
        },
      });
      return asset;
    })
    .sort((a, b) => a.mktValue.sub(b.mktValue).toNumber());

  return assets;
};

export const parseSuiWalletAssetList = (coinAmountList: CoinAmount[]): Asset[] => {
  const { getCoinPrice } = usePriceContext;
  const assets = coinAmountList
    .filter(asset => asset.amount.gt(0))
    .map((coin) => {
      const price = getCoinPrice(coin.coinInfo);
      const asset = new Asset({
        name: coin.coinInfo.symbol,
        amount: coin.amount,
        price,
        logoURI: coin.coinInfo.logoURI,
        coinProfile: coin.coinInfo,
        info: {
          protocol: 'wallet'
        },
      });
      return asset;
    })
    .sort((a, b) => a.mktValue.sub(b.mktValue).toNumber());

  return assets;
};
