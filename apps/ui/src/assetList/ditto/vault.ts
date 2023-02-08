import type { MaybeHexString } from 'aptos';
import type { MoveResource, U64 } from 'aptos/src/generated';
import { fetchAccountResource } from 'src/config/chain/client';
import { getCoinProfileBySymbol } from 'src/config/coinList';
import { usePriceContext } from 'src/contexts/Price';
import { Asset } from 'src/types/asset';
import { CoinAmount, protocolBook } from 'umi-sdk';
import type { DittoPoolData } from './type';

export const fetchDittoPool = async (accountAddress: MaybeHexString, coinType: string) => {
  const resourceType = `0x1::coin::CoinStore<${protocolBook.ditto.accounts().pool}::staked_coin::StakedAptos>`;
  const r = await fetchAccountResource<DittoPoolData>(accountAddress, resourceType);

  console.log(r);

  return r;
};

export const fetchDittoPositionByAddress = async (address: MaybeHexString, coinType: string) => {

  const depositing = await fetchDittoPool(address, coinType);

  if (depositing.isErr()) return {};

  return { depositing };
};

export const parseDittoAssets = (accountResources: MoveResource[]): Asset[] => {
  const APT = getCoinProfileBySymbol('APT');
  const stAPT = getCoinProfileBySymbol('stAPT');
  const { getCoinPrice } = usePriceContext;

  const r = accountResources.find(r => r.type === `0x1::coin::CoinStore<${stAPT.type}>`);
  if (r) {
    const data = r.data as { coin: { value: U64 } };
    const stAPTAmount = new CoinAmount(stAPT, data.coin.value);

    const aptPrice = getCoinPrice(APT);
    const estimatedClaimableAPTBalance = stAPTAmount.amount;

    const asset = new Asset({
      name: 'APT',
      amount: estimatedClaimableAPTBalance,
      price: aptPrice,
      logoURI: APT.logoURI,
      coinProfile: APT,
      info: {
        protocol: 'ditto'
      }
    });

    return [asset];
  }
  return [];
};
