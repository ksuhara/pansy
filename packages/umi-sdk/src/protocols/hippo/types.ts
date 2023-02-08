import { PoolStatus } from '../../types';

export interface HippoLiquidityPool {
  'balance_x': {
    'value': string
  },
  'balance_y': {
    'value': string
  },
  'burn_cap': {
    'dummy_field': boolean
  },
  'creator': string
  'fee_on': boolean
  'fee_to': string
  'freeze_cap': {
    'dummy_field': boolean
  },
  'k_last': string
  'locked': boolean
  'lp': {
    'value': string
  },
  'mint_cap': {
    'dummy_field': boolean
  }
}

export enum HippoPoolType {
  const_product = '1',
  stable_curve = '2',
  priecewise = '3',
}

export interface HippoPoolInfo extends PoolStatus {
  poolType: HippoPoolType;
}
