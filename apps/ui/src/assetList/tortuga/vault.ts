import type { MaybeHexString } from 'aptos';
import type { MoveResource, U64 } from 'aptos/src/generated';
import { fetchAccountResource } from 'src/config/chain/client';
import { getCoinProfileBySymbol } from 'src/config/coinList';
import { usePriceContext } from 'src/contexts/Price';
import { Asset } from 'src/types/asset';
// import { protocolBook } from 'umi-sdk';
import { CoinAmount } from 'umi-sdk';
import type { TortugaPoolData } from './type';

const fetchTortugaVault = async (accountAddress: MaybeHexString) => {
  // const resourceType = `0x1::coin::CoinStore<${protocolBook.tortuga.accounts().pool}::staked_aptos_coin::StakedAptosCoin>`;
  const resourceType = '0x1::coin::CoinStore<0x84d7aeef42d38a5ffc3ccef853e1b82e4958659d16a7de736a29c55fbbeb0114::staked_aptos_coin::StakedAptosCoin>';

  const r = await fetchAccountResource<TortugaPoolData>(accountAddress, resourceType);

  return r;
};

const fetchTortugaPositionByAddress = async (address: MaybeHexString) => {

  const depositing = await fetchTortugaVault(address);

  if (depositing.isErr()) return {};

  return { depositing };
};

export const parseTortugaAssets = (accountResources: MoveResource[]): Asset[] => {
  const APT = getCoinProfileBySymbol('APT');
  const tAPT = getCoinProfileBySymbol('tAPT');
  const { getCoinPrice } = usePriceContext;

  const r = accountResources.find(r => r.type === `0x1::coin::CoinStore<${tAPT.type}>`);
  if (r) {
    const data = r.data as { coin: { value: U64 } };
    const tAPTAmount = new CoinAmount(tAPT, data.coin.value);

    const aptPrice = getCoinPrice(APT);
    const taptPrice = getCoinPrice(tAPT);
    const exchangeRate = taptPrice.div(aptPrice);

    const estimatedClaimableAPTBalance = tAPTAmount.amount.mul(exchangeRate);
    const coinAmount = new CoinAmount(getCoinProfileBySymbol('APT'), estimatedClaimableAPTBalance);

    const asset = new Asset({
      name: 'APT',
      amount: coinAmount.amount,
      price: aptPrice,
      logoURI: APT.logoURI,
      coinProfile: APT,
      info: {
        protocol: 'tortuga'
      }
    });

    return [asset];
  }

  return [];
};
