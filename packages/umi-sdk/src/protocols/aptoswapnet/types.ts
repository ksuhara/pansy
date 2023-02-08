import type { U64 } from 'aptos/src/generated';
import type Decimal from 'decimal.js';
import { PoolInfoFull, PoolStatus } from '../../types';

export type AptoswapnetPool = {
  'admin_fee': string
  'connect_fee': string
  'incentive_fee': string
  'fee_direction': number
  'lp_fee': string
  'x': { 'value': U64 }
  'y': { 'value': U64 }
};

export type AptoswapnetPoolInfoFull = PoolInfoFull & {
  protocolName: 'Aptoswap'
  extensions: {
    admin_fee: Decimal
    connect_fee: Decimal
    incentive_fee: Decimal
    lp_fee: Decimal
  }
};


export type AptoswapnetPoolStatus = PoolStatus & {
  protocolName: 'aptoswapnet'
  extensions: {
    fee_direction: 'x' | 'y'
    admin_fee: Decimal
    connect_fee: Decimal
    incentive_fee: Decimal
    lp_fee: Decimal
  }
};
