import type { U64 } from 'aptos/src/generated';
import Decimal from 'decimal.js';
import { PoolStatus } from '../../types';

export interface AuxLiquidityPool {
  x_reserve: { value: U64 }
  y_reserve: { value: U64 }
  fee_bps: U64
}


export type AuxLiquidityPoolStatus = PoolStatus & {
  protocolName: 'aux'
  extensions: {
    feeRate: Decimal
  }
}
