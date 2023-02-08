import type { U128 } from 'aptos/src/generated';
import { PoolStatus } from '../../types';

export type ObricLiquidityPool = {
  'K': U128,
  'K2': U128
  'Xa': U128,
  'Xb': U128,
  'lp_amt': U128,
  'lp_burn_cap': {
    'dummy_field': boolean
  },
  'lp_freeze_cap': {
    'dummy_field': boolean
  },
  'lp_mint_cap': {
    'dummy_field': boolean
  },
  'm': U128
  'n': U128
  'protocol_fee_share_per_thousand': U128
  'protocol_fee_x': {
    'value': U128
  },
  'protocol_fee_y': {
    'value': U128
  },
  'reserve_x': {
    'value': U128
  },
  'reserve_y': {
    'value': U128
  },
  'swap_fee_per_million': U128
  'x_deci_mult': U128
  'y_deci_mult': U128
};

export type ObricPoolStatus = PoolStatus & {
  protocolName: 'obric'
  extensions: {
    config: {
      'x_deci_mult': U128
      'y_deci_mult': U128
      'K': U128
      'K2': U128
      'Xa': U128
      'Xb': U128
      'm': U128
      'n': U128
      'swap_fee_per_million': U128
    }
  }
};