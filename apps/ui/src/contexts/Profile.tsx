import type { TypeTagString } from '@manahippo/move-to-ts';
import { parseResourceType } from '@manahippo/move-to-ts';
import { createContextProvider } from '@solid-primitives/context';
import type { MaybeHexString } from 'aptos';
import type { MoveResource } from 'aptos/src/generated';
import Decimal from 'decimal.js';
import { createEffect, createMemo, createSignal } from 'solid-js';
import { parseArgoAssets } from 'src/assetList/argo/vault';
import { parseDittoAssets } from 'src/assetList/ditto/vault';
import { parseTortugaAssets } from 'src/assetList/tortuga/vault';
import { accumulateAssetsByCoin, accumulateAssetsByProtocol, accumulateMktValue } from 'src/assetList/utils';
import { parseAptosWalletAssetList, parseSuiWalletAssetList } from 'src/assetList/walletAssetList';
import { getCoinProfileByType } from 'src/config/coinList';
import type { Asset } from 'src/types/asset';
import { PairAssets } from 'src/types/asset';
import type { PontemLiqudityPool, PontemPoolStatus, PoolStatus } from 'umi-sdk';
import { CoinAmount, fetchAccountResource, fetchAccountResources, protocolBook } from 'umi-sdk';
import { useNetwork } from './Network';
import { usePriceContext } from './Price';
import { useAptosWallet } from './WalletProvider';

export const fetchAnimePoolSupply = async(coinTypeX: string, coinTypeY: string) => {
  const ownerAccount = protocolBook.anime.accounts().pool;
  const lpTokenType = `0x1::coin::CoinInfo<0x796900ebe1a1a54ff9e932f19c548f5c1af5c6e7d34965857ac2f7b1d1ab2cbf::LPCoinV1::LPCoin<${coinTypeX}, ${coinTypeY}>>`;
  const data = await fetchAccountResource(ownerAccount, lpTokenType);
  if (data.isErr()) return;
  const totalSupply = new Decimal(data.value.supply.vec[0].integer.vec[0].value);
  const keyValue = { lpTokenType, totalSupply };
  return keyValue;
};

export const fetchAnimeAccountPool = async(coinTypeX: string, coinTypeY: string): Promise<PoolStatus> => {
  const ownerAccount = protocolBook.anime.accounts().pool;
  const resourceType = `${protocolBook.anime.structs().LiquidityPool}<${coinTypeX}, ${coinTypeY}>`;
  const r = await fetchAccountResource(ownerAccount, resourceType);
  if (r.isErr()) return;
  const coinXInfo = getCoinProfileByType(coinTypeX);
  const coinYInfo = getCoinProfileByType(coinTypeY);
  const coinX = new CoinAmount(coinXInfo, r.value.coin_x_reserve.value);
  const coinY = new CoinAmount(coinYInfo, r.value.coin_y_reserve.value);
  const pool: PoolStatus = {
    protocolName: 'anime',
    resourceType: resourceType,
    ownerAccount,
    pair: {
      name: `${coinX.coinInfo.symbol}-${coinY.coinInfo.symbol}`,
      coinX,
      coinY,
    },
    calcOutputAmount: undefined,
  };
  return pool;
};

export const parseAnimeAssets = async(resources: MoveResource[]): Promise<PairAssets[]> => {

  const { getCoinPrice } = usePriceContext;

  const resourceTypePrefix = '0x1::coin::CoinStore<0x796900ebe1a1a54ff9e932f19c548f5c1af5c6e7d34965857ac2f7b1d1ab2cbf::LPCoinV1::LPCoin<';

  const assets = resources
    .filter(r => r.type.startsWith(resourceTypePrefix))
    .flatMap(async(r) => {
      const lpTokenType: TypeTagString = parseResourceType(r.type)
        .typeParams[0].getFullname();
      const [coinTypeX, coinTypeY] = parseResourceType(lpTokenType)
        .typeParams
        .map(typeTag => typeTag.getFullname() as TypeTagString);

      const keyValue = await fetchAnimePoolSupply(coinTypeX, coinTypeY);

      const totalSupply = keyValue.totalSupply;

      const poolShare = new Decimal(r.data.coin.value).div(totalSupply);

      const pool = await fetchAnimeAccountPool(coinTypeX, coinTypeY);
      // if (!pool) return [];

      const assetX: CoinAmount = pool.pair.coinX;
      const assetY: CoinAmount = pool.pair.coinY;

      const pairAssets = new PairAssets({
        name: [assetX.coinInfo.symbol, assetY.coinInfo.symbol],
        amount: [assetX.amount.mul(poolShare), assetY.amount.mul(poolShare)],
        logoURI: [assetX.coinInfo.logoURI, assetY.coinInfo.logoURI],
        price: [getCoinPrice(assetX.coinInfo), getCoinPrice(assetY.coinInfo)],
        coinProfile: [assetX.coinInfo, assetY.coinInfo],
        info: {
          protocol: 'anime',
          lpTokenType,
        }
      });
      return pairAssets;
    });
  const results: PairAssets[] = await Promise.all(assets);

  return results;
};

export const fetchPancakePoolSupply = async(coinTypeX: string, coinTypeY: string) => {
  const ownerAccount = protocolBook.pancake.accounts().pool;
  const lpTokenType = `0x1::coin::CoinInfo<0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<${coinTypeX}, ${coinTypeY}>>`;
  const data = await fetchAccountResource(ownerAccount, lpTokenType);
  if (data.isErr()) return;
  const totalSupply = new Decimal(data.value.supply.vec[0].integer.vec[0].value);
  const keyValue = { lpTokenType, totalSupply };
  return keyValue;
};

export const fetchPancakeAccountPool = async(coinTypeX: string, coinTypeY: string): Promise<PoolStatus> => {
  const ownerAccount = protocolBook.pancake.accounts().pool;
  const resourceType = `${protocolBook.pancake.structs().TokenPairReserve}<${coinTypeX}, ${coinTypeY}>`;
  const r = await fetchAccountResource(ownerAccount, resourceType);
  if (r.isErr()) return;
  const coinXInfo = getCoinProfileByType(coinTypeX);
  const coinYInfo = getCoinProfileByType(coinTypeY);
  const coinX = new CoinAmount(coinXInfo, r.value.reserve_x);
  const coinY = new CoinAmount(coinYInfo, r.value.reserve_y);
  const pool: PoolStatus = {
    protocolName: 'pancake',
    resourceType: resourceType,
    ownerAccount,
    pair: {
      name: `${coinX.coinInfo.symbol}-${coinY.coinInfo.symbol}`,
      coinX,
      coinY,
    },
    calcOutputAmount: undefined,
  };
  return pool;
};

export const parsePancakeAssets = async(resources: MoveResource[]): Promise<PairAssets[]> => {

  const { getCoinPrice } = usePriceContext;

  const resourceTypePrefix = '0x1::coin::CoinStore<0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<';

  const assets = resources
    .filter(r => r.type.startsWith(resourceTypePrefix))
    .flatMap(async(r) => {
      const lpTokenType: TypeTagString = parseResourceType(r.type)
        .typeParams[0].getFullname();
      const [coinTypeX, coinTypeY] = parseResourceType(lpTokenType)
        .typeParams
        .map(typeTag => typeTag.getFullname() as TypeTagString);

      const keyValue = await fetchPancakePoolSupply(coinTypeX, coinTypeY);

      const totalSupply = keyValue.totalSupply;

      const poolShare = new Decimal(r.data.coin.value).div(totalSupply);

      const pool = await fetchPancakeAccountPool(coinTypeX, coinTypeY);
      // if (!pool) return [];

      const assetX: CoinAmount = pool.pair.coinX;
      const assetY: CoinAmount = pool.pair.coinY;

      const pairAssets = new PairAssets({
        name: [assetX.coinInfo.symbol, assetY.coinInfo.symbol],
        amount: [assetX.amount.mul(poolShare), assetY.amount.mul(poolShare)],
        logoURI: [assetX.coinInfo.logoURI, assetY.coinInfo.logoURI],
        price: [getCoinPrice(assetX.coinInfo), getCoinPrice(assetY.coinInfo)],
        coinProfile: [assetX.coinInfo, assetY.coinInfo],
        info: {
          protocol: 'anime',
          lpTokenType,
        }
      });
      return pairAssets;
    });
  const results: PairAssets[] = await Promise.all(assets);

  return results;
};

export const fetchPontemPoolSupply = async(coinTypeX: string, coinTypeY: string, curveType: string) => {
  const ownerAccount = protocolBook.pontem.accounts().pool;
  const lpTokenType = `0x1::coin::CoinInfo<0x5a97986a9d031c4567e15b797be516910cfcb4156312482efc6a19c0a30c948::lp_coin::LP<${coinTypeX}, ${coinTypeY}, ${curveType}>>`;
  const data = await fetchAccountResource(ownerAccount, lpTokenType);
  if (data.isErr()) return;
  const totalSupply = new Decimal(data.value.supply.vec[0].integer.vec[0].value);
  const keyValue = { lpTokenType, totalSupply };
  return keyValue;
};

export const fetchPontemAccountPool = async(coinTypeX: string, coinTypeY: string, curveType: string): Promise<PontemPoolStatus> => {
  const ownerAccount = protocolBook.pontem.accounts().pool;
  const resourceType = `${protocolBook.pontem.structs().LiquidityPool}<${coinTypeX}, ${coinTypeY}, ${curveType}>`;
  const r = await fetchAccountResource<PontemLiqudityPool>(ownerAccount, resourceType);
  if (r.isErr()) return;
  const coinXInfo = getCoinProfileByType(coinTypeX);
  const coinYInfo = getCoinProfileByType(coinTypeY);
  const coinX = new CoinAmount(coinXInfo, r.value.coin_x_reserve.value);
  const coinY = new CoinAmount(coinYInfo, r.value.coin_y_reserve.value);
  const pool: PontemPoolStatus = {
    protocolName: 'pontem',
    resourceType: resourceType,
    ownerAccount,
    pair: {
      name: `${coinX.coinInfo.symbol}-${coinY.coinInfo.symbol}`,
      coinX,
      coinY,
    },
    calcOutputAmount: undefined,
    extensions: {
      curveType,
      fee: Number(r.value.fee),
    },
  };
  return pool;
};

export const parsePontemAssets = async(resources: MoveResource[]): Promise<PairAssets[]> => {

  const { getCoinPrice } = usePriceContext;

  const resourceTypePrefix = '0x1::coin::CoinStore<0x5a97986a9d031c4567e15b797be516910cfcb4156312482efc6a19c0a30c948::lp_coin::LP<';

  const assets = resources
    .filter(r => r.type.startsWith(resourceTypePrefix))
    .flatMap(async(r) => {
      const lpTokenType: TypeTagString = parseResourceType(r.type)
        .typeParams[0].getFullname();
      const [coinTypeX, coinTypeY, curveType] = parseResourceType(lpTokenType)
        .typeParams
        .map(typeTag => typeTag.getFullname() as TypeTagString);

      const keyValue = await fetchPontemPoolSupply(coinTypeX, coinTypeY, curveType);

      const totalSupply = keyValue.totalSupply;

      const poolShare = new Decimal(r.data.coin.value).div(totalSupply);

      const pool = await fetchPontemAccountPool(coinTypeX, coinTypeY, curveType);
      // if (!pool) return [];

      const assetX: CoinAmount = pool.pair.coinX;
      const assetY: CoinAmount = pool.pair.coinY;

      const pairAssets = new PairAssets({
        name: [assetX.coinInfo.symbol, assetY.coinInfo.symbol],
        amount: [assetX.amount.mul(poolShare), assetY.amount.mul(poolShare)],
        logoURI: [assetX.coinInfo.logoURI, assetY.coinInfo.logoURI],
        price: [getCoinPrice(assetX.coinInfo), getCoinPrice(assetY.coinInfo)],
        coinProfile: [assetX.coinInfo, assetY.coinInfo],
        info: {
          protocol: 'pontem',
          lpTokenType,
        }
      });
      return pairAssets;
    });
  const results: PairAssets[] = await Promise.all(assets);

  return results;
};

export const fetchAuxPoolSupply = async(coinTypeX: string, coinTypeY: string) => {
  const ownerAccount = protocolBook.aux.accounts().pool;
  const lpTokenType = `0x1::coin::CoinInfo<0xbd35135844473187163ca197ca93b2ab014370587bb0ed3befff9e902d6bb541::amm::LP<${coinTypeX}, ${coinTypeY}>>`;
  const data = await fetchAccountResource(ownerAccount, lpTokenType);
  if (data.isErr()) return;
  const totalSupply = new Decimal(data.value.supply.vec[0].integer.vec[0].value);
  const keyValue = { lpTokenType, totalSupply };
  return keyValue;
};

export const fetchAuxAccountPool = async(coinTypeX: string, coinTypeY: string): Promise<PoolStatus> => {
  const ownerAccount = protocolBook.aux.accounts().pool;
  const resourceType = `${protocolBook.aux.structs().Pool}<${coinTypeX}, ${coinTypeY}>`;
  const r = await fetchAccountResource(ownerAccount, resourceType);
  if (r.isErr()) return;
  const coinXInfo = getCoinProfileByType(coinTypeX);
  const coinYInfo = getCoinProfileByType(coinTypeY);
  const coinX = new CoinAmount(coinXInfo, r.value.x_reserve.value);
  const coinY = new CoinAmount(coinYInfo, r.value.y_reserve.value);
  const pool: PoolStatus = {
    protocolName: 'aux',
    resourceType: resourceType,
    ownerAccount,
    pair: {
      name: `${coinX.coinInfo.symbol}-${coinY.coinInfo.symbol}`,
      coinX,
      coinY,
    },
    calcOutputAmount: undefined,
  };
  return pool;
};

export const parseAuxAssets = async(resources: MoveResource[]): Promise<PairAssets[]> => {

  const { getCoinPrice } = usePriceContext;

  const resourceTypePrefix = '0x1::coin::CoinStore<0xbd35135844473187163ca197ca93b2ab014370587bb0ed3befff9e902d6bb541::amm::LP<';

  const assets = resources
    .filter(r => r.type.startsWith(resourceTypePrefix))
    .flatMap(async(r) => {
      const lpTokenType: TypeTagString = parseResourceType(r.type)
        .typeParams[0].getFullname();
      const [coinTypeX, coinTypeY] = parseResourceType(lpTokenType)
        .typeParams
        .map(typeTag => typeTag.getFullname() as TypeTagString);

      const keyValue = await fetchAuxPoolSupply(coinTypeX, coinTypeY);

      const totalSupply = keyValue.totalSupply;

      const poolShare = new Decimal(r.data.coin.value).div(totalSupply);

      const pool = await fetchAuxAccountPool(coinTypeX, coinTypeY);
      // if (!pool) return [];

      const assetX: CoinAmount = pool.pair.coinX;
      const assetY: CoinAmount = pool.pair.coinY;

      const pairAssets = new PairAssets({
        name: [assetX.coinInfo.symbol, assetY.coinInfo.symbol],
        amount: [assetX.amount.mul(poolShare), assetY.amount.mul(poolShare)],
        logoURI: [assetX.coinInfo.logoURI, assetY.coinInfo.logoURI],
        price: [getCoinPrice(assetX.coinInfo), getCoinPrice(assetY.coinInfo)],
        coinProfile: [assetX.coinInfo, assetY.coinInfo],
        info: {
          protocol: 'aux',
          lpTokenType,
        }
      });
      return pairAssets;
    });
  const results: PairAssets[] = await Promise.all(assets);

  return results;
};

export const [ProfileProvider, useProfile] = createContextProvider(() => {
  const { networkName } = useNetwork();
  const { account, connected } = useAptosWallet();
  const getWalletAddress = () => connected() && account().address as MaybeHexString;
  const { getCoinPrice } = usePriceContext;

  const [profileAddress, setProfileAddress] = createSignal(getWalletAddress());
  const [lpTokens, setLpTokens] = createSignal<CoinAmount[]>([]);
  const [aptinBorrowings, setAptinBorrowings] = createSignal<CoinAmount[]>([]);
  const [aptinLendings, setAptinLendings] = createSignal<CoinAmount[]>([]);
  const [marketplaces, setMarketplaces] = createSignal<CoinAmount[]>([]);
  const [accountResources, setAccountResource] = createSignal<MoveResource[]>([]);
  const [animeAssetList, setAnimeAssetList] = createSignal<PairAssets[]>([]);
  const [pancakeAssetList, setPancakeAssetList] = createSignal<PairAssets[]>([]);
  const [pontemAssetList, setPontemAssetList] = createSignal<PairAssets[]>([]);
  const [auxAssetList, setAuxAssetList] = createSignal<PairAssets[]>([]);
  const [assetList, setAssetList] = createSignal<Asset[]>([]);

  const { reloadCoinPrices } = usePriceContext;

  const refetchAccountResources = async () => {
    const resources = await fetchAccountResources(profileAddress()).unwrapOr([]);
    setAccountResource(resources);
  };
  createEffect(refetchAccountResources);

  const reparsePancakeAssets = async() => {
    const assets = await parsePancakeAssets(accountResources());
    setPancakeAssetList(assets);
  };
  createEffect(reparsePancakeAssets);

  const reparseAnimeAssets = async() => {
    const assets = await parseAnimeAssets(accountResources());
    setAnimeAssetList(assets);
  };
  createEffect(reparseAnimeAssets);

  const reparsePontemAssets = async() => {
    const assets = await parsePontemAssets(accountResources());
    setPontemAssetList(assets);
  };
  createEffect(reparsePontemAssets);

  const reparseAuxAssets = async() => {
    const assets = await parseAuxAssets(accountResources());
    setAuxAssetList(assets);
  };
  createEffect(reparseAuxAssets);

  createEffect(() => {
    if (!profileAddress()) {
      setAptinLendings([]);
      setAptinBorrowings([]);
      setMarketplaces([]);
    }
  });

  const [walletAssetList, setWalletAssetList] = createSignal<Asset[]>([]);

  const refetchAssets = () => {
    if (networkName() === 'AptosMainnet') {
      const asset = parseAptosWalletAssetList(accountResources());
      setWalletAssetList(asset);
    } else
    if (networkName() === 'SuiDevnet') {
      const asset = parseSuiWalletAssetList(assets());
      setWalletAssetList(asset);
    }
  };
  createEffect(refetchAssets);

  const dittoAssetList = createMemo(() => parseDittoAssets(accountResources()));
  const tortugaAssetList = createMemo(() => parseTortugaAssets(accountResources()));
  const argoAssetList = createMemo(() => parseArgoAssets(accountResources()));

  const allAssets = createMemo(() => [
    ...dittoAssetList(),
    ...tortugaAssetList(),
    ...argoAssetList(),
  ]);

  const savingAssetList = createMemo(() => [
    ...dittoAssetList(),
    ...tortugaAssetList(),
    ...argoAssetList(),
  ]);

  const assetsByCoin = createMemo(() => accumulateAssetsByCoin(walletAssetList()));

  const assetsByProtocol = createMemo(() => accumulateAssetsByProtocol(allAssets()));

  const totalMktValue = createMemo(() => accumulateMktValue(assetsByCoin()));

  const refetchAll = async () => {
    await reloadCoinPrices();
    await refetchAccountResources();
    await reparseAnimeAssets();
    await reparsePancakeAssets();
    await reparsePontemAssets();
    await reparseAuxAssets();
    await refetchAssets();
  };
  createEffect(refetchAll);

  return {
    assetsByCoin,
    assetsByProtocol,
    totalMktValue,
    accountResources,
    profileAddress,
    aptinBorrowings,
    walletAssetList,
    refetchAssets,
    aptinLendings,
    lpTokens,
    marketplaces,
    dittoAssetList,
    animeAssetList,
    auxAssetList,
    argoAssetList,
    tortugaAssetList,
    pancakeAssetList,
    pontemAssetList,
    refetchAccountResources,
    setProfileAddress,
    savingAssetList,
  };
});
