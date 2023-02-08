import type { Types } from 'aptos';
import type { CoinProfile } from 'umi-sdk';

export const registerCoinTransactionPayload = (
  coin: CoinProfile,
): Types.TransactionPayload => {
  return {
    'arguments': [],
    'function': '0x1::managed_coin::register',
    'type': 'entry_function_payload',
    'type_arguments': [
      coin.address
    ]
  };
};
