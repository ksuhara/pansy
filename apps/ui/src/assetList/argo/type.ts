// import type { MaybeHexString } from 'aptos';
// import type { U64 } from 'aptos/src/generated';

import type { U64 } from 'aptos/src/generated';

// export interface ArgoVault {
//   'collateral': {
//     'value': U64
//   },
//   'id': U64
//   'mark_info': {
//     'mark_price': U64
//     'marker_addr': MaybeHexString
//     'timestamp': U64
//   },
//   'unscaled_debt': U64
//   'vault_supply': U64
// }

export type ArgoVaultData = {
  accounting_events: {
    counter: string;
    guid: {
      id: {
        addr: string;
        creation_num: string;
      };
    };
  };
  collateral: {
    value: U64;
  };
  id: string;
  mark_info: {
    mark_price: string;
    marker_addr: string;
    timestamp: string;
  };
  unscaled_debt: string;
  vault_supply: string;
};
