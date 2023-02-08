import { U64 } from 'aptos/src/generated';
import { err, ok } from 'neverthrow';
import { DexType, protocolBook } from '../../protocolList';
import { AnimeSwapPoolStatus } from '../../protocols/anime/type';
import { AptoswapnetPoolStatus } from '../../protocols/aptoswapnet/types';
import { AuxLiquidityPoolStatus } from '../../protocols/aux/types';
import { HippoPoolInfo } from '../../protocols/hippo/types';
import { PontemPoolStatus } from '../../protocols/pontem/type';
import { PoolStatus, SwapInfo } from '../../types';

export const getLiquidswapTypeArgs = (pool: PontemPoolStatus, x2y: boolean) => {
  const X = pool.pair.coinX.coinInfo.type;
  const Y = pool.pair.coinY.coinInfo.type;
  const E = pool.extensions.curveType;

  if (x2y) return [X, Y, E];
  return [Y, X, E];
};

export const getHippoTypeArgs = (pool: HippoPoolInfo, x2y: boolean) => {
  const X = pool.pair.coinX.coinInfo.type;
  const Y = pool.pair.coinY.coinInfo.type;

  if (x2y) return [X, Y, 'u8'];
  return [Y, X, 'u8'];
};

export const getAptoswapnetTypeArgs = (pool: AptoswapnetPoolStatus, x2y: boolean) => {
  const X = pool.pair.coinX.coinInfo.type;
  const Y = pool.pair.coinY.coinInfo.type;

  if (x2y) return [X, Y, 'u8'];
  return [Y, X, 'u8'];
};

export const getAnimeSwapTypeArgs = (pool: AnimeSwapPoolStatus, x2y: boolean) => {
  const X = pool.pair.coinX.coinInfo.type;
  const Y = pool.pair.coinY.coinInfo.type;

  if (x2y) return [X, Y, 'u8'];
  return [Y, X, 'u8'];
};

export const getAuxTypeArgs = (pool: AuxLiquidityPoolStatus, x2y: boolean) => {
  const X = pool.pair.coinX.coinInfo.type;
  const Y = pool.pair.coinY.coinInfo.type;

  if (x2y) return [X, Y, 'u8'];
  return [Y, X, 'u8'];
};

export const getCetusTypeArgs = (pool: PoolStatus, x2y: boolean) => {
  const X = pool.pair.coinX.coinInfo.type;
  const Y = pool.pair.coinY.coinInfo.type;

  if (x2y) return [X, Y, 'u8'];
  return [Y, X, 'u8'];
};

export const getObricTypeArgs = (pool: PoolStatus, x2y: boolean) => {
  const X = pool.pair.coinX.coinInfo.type;
  const Y = pool.pair.coinY.coinInfo.type;

  if (x2y) return [X, Y, 'u8'];
  return [Y, X, 'u8'];
};

export const getPancakeTypeArgs = (pool: PoolStatus, x2y: boolean) => {
  const X = pool.pair.coinX.coinInfo.type;
  const Y = pool.pair.coinY.coinInfo.type;

  if (x2y) return [X, Y, 'u8'];
  return [Y, X, 'u8'];
};

const unsupportedDexErr = (dexName: string) => err(`Unsupported dex: ${dexName}`);

export const getPoolType = (pool: PoolStatus): U64 => {
  if (pool.protocolName === protocolBook.hippo.name) {
    return (pool as HippoPoolInfo).poolType;
  }

  return '0';
};

export const getTypeArgs = (pool: PoolStatus, x2y: boolean) => {
  if (pool.protocolName === 'anime') {
    return ok(getAnimeSwapTypeArgs(pool as AnimeSwapPoolStatus, x2y));
  }

  if (pool.protocolName === 'aptoswapnet') {
    return ok(getAptoswapnetTypeArgs(pool as AptoswapnetPoolStatus, x2y));
  }

  if (pool.protocolName === 'aux') {
    return ok(getAuxTypeArgs(pool as AuxLiquidityPoolStatus, x2y));
  }

  if (pool.protocolName === 'cetus') {
    return ok(getCetusTypeArgs(pool, x2y));
  }

  if (pool.protocolName === 'hippo') {
    return ok(getHippoTypeArgs(pool as HippoPoolInfo, x2y));
  }

  if (pool.protocolName === 'obric') {
    return ok(getObricTypeArgs(pool, x2y));
  }

  if (pool.protocolName === 'pancake') {
    return ok(getPancakeTypeArgs(pool, x2y));
  }

  if (pool.protocolName === 'pontem') {
    return ok(getLiquidswapTypeArgs(pool as PontemPoolStatus, x2y));
  }

  return unsupportedDexErr(pool.protocolName);
};

export const getDexType = (pool: PoolStatus) => {
  if (pool.protocolName === 'anime') {
    return ok(DexType.Anime)
  }

  if (pool.protocolName === 'aptoswapnet') {
    return ok(DexType.Aptoswap)
  }

  if (pool.protocolName === 'aux') {
    return ok(DexType.Aux)
  }

  if (pool.protocolName === 'cetus') {
    return ok(DexType.Cetus)
  }

  if (pool.protocolName === 'hippo') {
    return ok(DexType.Hippo);
  }

  if (pool.protocolName === 'obric') {
    return ok(DexType.Obric);
  }

  if (pool.protocolName === 'pancake') {
    return ok(DexType.Pancake)
  }

  if (pool.protocolName === 'pontem') {
    return ok(DexType.Pontem.toString());
  }

  return unsupportedDexErr(pool.protocolName);
};

export const is_x_to_y_ = ({ fromCoin, pool }: SwapInfo) => {
  return fromCoin.coinInfo.type === pool.pair.coinX.coinInfo.type;
};
