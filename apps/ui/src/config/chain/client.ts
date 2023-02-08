import type { MaybeHexString } from 'aptos';
import { AptosClient, FaucetClient } from 'aptos';
import { ResultAsync } from 'neverthrow';
import type { ErrorMessage } from 'umi-sdk/src/types/aptos';
import { selectedEndpoint } from '.';

export const DEVNET_NODE_URL = 'https://fullnode.devnet.aptoslabs.com/v1';
export const DEVNET_FAUCET_URL = 'https://faucet.devnet.aptoslabs.com';

export const TESTNET_NODE_URL = 'https://testnet.aptoslabs.com';
export const TESTNET_FAUCET_URL = 'https://faucet.testnet.aptoslabs.com';

export const MAINNET_NODE_URL = 'https://mainnet.aptoslabs.com';

export const deventAptosClient = new AptosClient(DEVNET_NODE_URL);
export const devnetFaucetClient = new FaucetClient(DEVNET_NODE_URL, DEVNET_FAUCET_URL);

export const testnetAptosClient = new AptosClient(TESTNET_NODE_URL);
export const testnetFaucetClient = new FaucetClient(TESTNET_NODE_URL, TESTNET_FAUCET_URL);

export const mainnetAptosClient = new AptosClient(MAINNET_NODE_URL);

export const aptosClient = () => {
  return new AptosClient(selectedEndpoint());
};

export const faucetClient = testnetFaucetClient;

export const fetchAccountResource = <T>(
  addr: MaybeHexString,
  resourceType: string,
) => ResultAsync.fromPromise(
  aptosClient().getAccountResource(addr, resourceType).then(r => r.data as T),
  (e: any) => e.body as ErrorMessage,
);

export const fetchAccountResources = (accountAddress: MaybeHexString) => {
  const fetcher = aptosClient().getAccountResources(accountAddress);
  const errorHandler = (e: any) => e.body as ErrorMessage;

  return ResultAsync.fromPromise(fetcher, errorHandler);
};
