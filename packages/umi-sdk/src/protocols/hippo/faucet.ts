import type { Types } from 'aptos';
import { protocolBook } from '../../protocolList';

export const createFaucetPayload = (coinType: string) => {

  const payload: Types.TransactionPayload = {
    'function': `${protocolBook.hippo.modules.coins}::mint_to_wallet`,
    'type_arguments': [
      coinType
    ],
    'arguments': [
      '100000000',
    ],
    'type': 'entry_function_payload'
  };

  return payload;
};
