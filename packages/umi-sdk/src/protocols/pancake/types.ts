import type { U128 } from '@manahippo/move-to-ts';
import type { U64 } from 'aptos/src/generated';

export interface PancakeLiquidityPool {
  'block_timestamp_last': U128
  'reserve_x': U64
  'reserve_y': U64
}
