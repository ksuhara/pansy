import { TypeTagParser } from 'aptos';
import type { MoveResource } from 'aptos/src/generated';
import { getCoinProfileBySymbol, getCoinProfileByType } from 'src/config/coinList';
import { usePriceContext } from 'src/contexts/Price';
import { Asset } from 'src/types/asset';
import { TypeTagStructToString } from 'src/utils/web3';
import { CoinAmount, protocolBook } from 'umi-sdk';
import type { ArgoVaultData } from './type';

export const parseArgoAssets = (accountResources: MoveResource[]): Asset[] => {
  const { getCoinPrice } = usePriceContext;
  const APT = getCoinProfileBySymbol('APT');

  const assets = accountResources
    .filter(r => r.type.startsWith(protocolBook.argo.structs().Vault))
    .map(r => {
      const coinType = TypeTagStructToString(new TypeTagParser(r.type).parseTypeTag().value.type_args[1]);
      const coin = getCoinProfileByType(coinType);
      const data = r.data as ArgoVaultData;
      const coinAmount = new CoinAmount(coin, data.collateral.value);
      const price = getCoinPrice(coin);

      const asset = new Asset({
        name: coin.name,
        amount: coinAmount.amount,
        price,
        logoURI: coin.logoURI,
        coinProfile: APT,
        info: {
          protocol: 'argo'
        },
      });
      return asset;
    });
  return assets;
};
