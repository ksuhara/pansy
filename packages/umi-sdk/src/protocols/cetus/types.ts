import { MaybeHexString } from 'aptos';
import type { U64 } from 'aptos/src/generated';

export interface CetusLiquidityPool {
  "coin_a": { "value": U64 },
  "coin_b": { "value": U64 },
  "protocol_fee_to": MaybeHexString
}
