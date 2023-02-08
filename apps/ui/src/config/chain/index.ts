import { createStorageSignal } from '@solid-primitives/storage';
import { createSignal } from 'solid-js';

export enum NetworkChain {
  mainnet = 1,
  testnet = 2,
}

export const endpointsMainnet = [
  // meganode umi team
  'https://aptos-mainnet.nodereal.io/v1/f4856a6fddf54c4aa63fda0cd735f34b',
  // // meganode imtk7 individual
  // 'https://aptos-mainnet.nodereal.io/v1/6aa96e87502444988d9fd7d97215702d',
  // 'https://fullnode.mainnet.aptoslabs.com/v1',
  // 'https://aptos-dollars.martianwallet.xyz',
  // 'https://rpc.mainnet.aptos.fernlabs.xyz',
  // 'https://rpc.ankr.com/http/aptos/v1',
];

export const endpointsTestnet = [
  'https://testnet.aptoslabs.com',
  'https://rpc.testnet.aptos.fernlabs.xyz',
  // 'https://rpc.ankr.com/http/aptos_testnet/v1',
];

export const endpointsDevnet = [
  'https://fullnode.devnet.aptoslabs.com/v1',
];

export const endpoints = [
  ...endpointsMainnet,
  ...endpointsTestnet,
  ...endpointsDevnet,
] as const;

type Endponts = typeof endpoints[number];

// export const [selectedEndpoint, setSelectedEndpoint] = createStorageSignal<string>('aptos-rpc-server-endpoint', endpoints[0]);
export const [selectedEndpoint, setSelectedEndpoint] = createSignal<string>(endpoints[0]);

export const [selectedChain, setSelectedChain] = createStorageSignal<NetworkChain>('network-chain', NetworkChain.mainnet);

export const isMainnet = () => selectedChain() === NetworkChain.mainnet;

export const isTestnet = () => selectedChain() === NetworkChain.testnet;
