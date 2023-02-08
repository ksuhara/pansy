import { TypeTagString } from '@manahippo/move-to-ts';
import type { ObjectId } from '@mysten/sui.js';
import { ProtocolName as SuiProtocolName } from '@umi-ag/sui-sdk';
import type { MaybeHexString } from 'aptos';
import { CoinAmount } from '../CoinAmount';
import { ProtocolName as AptosProtocolName } from '../protocolList';

type AptosPoolCore = {
  chain: 'aptos'
  protocolName: AptosProtocolName
  resourceType: TypeTagString
  ownerAccount: MaybeHexString
  pair: {
    name: string,
    coinX: CoinAmount,
    coinY: CoinAmount,
  }
}

type SuiPoolCore = {
  chain: 'sui'
  protocolName: SuiProtocolName
  resourceType: TypeTagString
  ownerAccount: MaybeHexString
  objectId: ObjectId
  pair: {
    name: string,
    coinX: CoinAmount
    coinY: CoinAmount
  }
}

export type PoolCore = AptosPoolCore | SuiPoolCore

export type CalcOutputAmount = (inputCoinAmount: CoinAmount, poolInfo: PoolCore) => {
  outputCoinAmount: CoinAmount,
  fees: CoinAmount[]
}

export type PoolStatus = PoolCore & {
  calcOutputAmount: CalcOutputAmount
}

export interface PoolCoreInfo {
  address: string,
  resourceType: string,
  lp: {
    address: string,
  },
  coinX: {
    address: string,
  },
  coinY: {
    address: string,
  };
  // TODO: Remove undefined
  feeDirection?: 'x' | 'y',
  protocolName: string,
}

export type PoolInfoFull = PoolCoreInfo & {
  pair: {
    name: string;
    coinX: CoinAmount;
    coinY: CoinAmount;
  };
};

export interface PontemPoolInfoRaw {
  'type': string;
  'data': {
    'coin_x_reserve': {
      'value': string;
    },
    'coin_y_reserve': {
      'value': string;
    },
    'curve_type': number,
    'last_block_timestamp': string;
    'last_price_x_cumulative': string;
    'last_price_y_cumulative': string;
    'lp_burn_cap': {
      'dummy_field': string;
    },
    'lp_mint_cap': {
      'dummy_field': string;
    },
    'x_scale': string;
    'y_scale': string;
  };
}

interface PontemPoolInfo {
  'type': string;
  'data': {
    'coin_x_reserve': {
      'value': number;
    },
    'coin_y_reserve': {
      'value': number;
    },
    'curve_type': 2,
    'last_block_timestamp': number;
    'last_price_x_cumulative': number;
    'last_price_y_cumulative': number;
    'lp_burn_cap': {
      'dummy_field': boolean;
    },
    'lp_mint_cap': {
      'dummy_field': boolean;
    },
    'x_scale': number;
    'y_scale': number;
  };
}
