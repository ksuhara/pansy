
export interface CoinProfile {
  chainId: number;
  decimals: number;
  address: string;
  symbol: string;
  official_symbol: string;
  name: string;
  logoURI: string;
  extensions?: Record<string, string>;
  tags?: string[];
}

export interface PontemCoinProfile {
  'chainId': number;
  'resourceType': string;
  'address': string;
  'symbol': string;
  'name': string;
  'logoURI': 'https://aptoslabs.com/favicon.svg',
  // "extensinos": {
  //     "address": "0x1"
  // }
}

export interface AptosCoinProfile {
  'decimals': number;
  'name': string;
  'symbol': string;
}
