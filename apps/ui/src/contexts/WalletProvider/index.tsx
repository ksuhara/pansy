import type {
  AccountKeys,
  WalletAdapter, WalletError
} from '@manahippo/aptos-wallet-adapter';
import {
  WalletAdapterNetwork, WalletNotConnectedError,
  WalletNotReadyError,
  WalletNotSelectedError, WalletReadyState, type NetworkInfo, type Wallet, type WalletName
} from '@manahippo/aptos-wallet-adapter';
import type { SimulationKeys } from '@manahippo/move-to-ts';
import { simulatePayloadTx } from '@manahippo/move-to-ts';
import { createContextProvider } from '@solid-primitives/context';
import { createLocalStorage, createStorageSignal } from '@solid-primitives/storage';
import type { Types } from 'aptos';
import { HexString } from 'aptos';
import type { TransactionPayload } from 'aptos/src/generated';
import { createEffect, createSignal } from 'solid-js';
import { aptosClient } from 'src/config/chain/client';
import type { SwapSettings } from 'umi-sdk';
import type { WhiteWalletName } from 'umi-sdk/src/types/wallet';

const initialState: {
  wallet: Wallet | null;
  adapter: WalletAdapter | null;
  account: AccountKeys | null;
  connected: boolean;
  network: NetworkInfo;
} = {
  wallet: null,
  adapter: null,
  account: null,
  connected: false,
  network: {
    name: WalletAdapterNetwork.Mainnet,
  }
};

export const [WalletProvider, useAptosWallet] = createContextProvider((props: {
  wallets: WalletAdapter[];
  onError?: (error: WalletError) => void;
  localStorageKey?: string;
}) => {
  const [, setName] = createLocalStorage<WalletName | null>(null);
  const [wallet, setWallet] = createSignal<Wallet | null>(null);
  const [adapter, setAdapter] = createSignal<WalletAdapter | null>(null);
  const [account, setAccount] = createSignal<AccountKeys | null>(null);
  const [connected, setConnected] = createSignal(false);
  const [network, setNetwork] = createSignal<NetworkInfo | null>(null);
  const readyState = adapter()?.readyState || WalletReadyState.Unsupported;
  const [connecting, setConnecting] = createSignal(false);
  const [disconnecting, setDisconnecting] = createSignal(false);
  const [isUnloading, setIsUnloading] = createSignal(false);
  // let isConnecting
  // let isDisconnecting
  // let isUnloading;

  // Wrap adapters to conform to the `Wallet` interface
  const [wallets, setWallets] = createSignal(
    props.wallets.map((adpt) => ({
      adapter: adpt,
      readyState: adpt.readyState
    }))
  );

  const [lastWallet, setLastWallet] = createStorageSignal<WhiteWalletName | ''>('selected-wallet', '');

  // When the wallets change, start to listen for changes to their `readyState`
  createEffect(() => {
    function handleReadyStateChange(this: WalletAdapter, isReadyState: WalletReadyState) {
      setWallets((prevWallets) => {
        const walletIndex = prevWallets.findIndex(
          // @ts-ignore
          (wAdapter) => wAdapter.adapter.name === this.name
        );
        if (walletIndex === -1) return prevWallets;

        return [
          ...prevWallets.slice(0, walletIndex),
          { ...prevWallets[walletIndex], isReadyState },
          ...prevWallets.slice(walletIndex + 1)
        ];
      });
    }
    for (const wAdapter of props.wallets) {
      wAdapter.on('readyStateChange', handleReadyStateChange, wAdapter);
    }
    return () => {
      for (const wAdapter of props.wallets) {
        wAdapter.off('readyStateChange', handleReadyStateChange, wAdapter);
      }
    };
  });

  // Handle the adapter's connect event
  const handleConnect = () => {
    if (!adapter()) return;
    setAccount(adapter().publicAccount);
    setConnected(adapter().connected);
  };

  const handleNetworkChnage = () => {
    if (!adapter()) return;
    setNetwork(adapter().network);
  };

  // Handle the adapter's disconnect event
  const handleDisconnect = () => {
    // Clear the selected wallet unless the window is unloading
    if (!isUnloading()) setName(props.localStorageKey, null);
    setWallet(null);
    setAdapter(null);
    setAccount(null);
    setConnected(false);
  };

  // Handle the adapter's error event, and local errors
  const handleError = (error: WalletError) => {
    // Call onError unless the window is unloading
    if (!isUnloading()) (props.onError || console.error)(error);
    return error;
  };

  // Setup and teardown event listeners when the adapter changes
  createEffect(() => {
    if (adapter()) {
      adapter().on('connect', handleConnect);
      adapter().on('networkChange', handleNetworkChnage);
      adapter().on('disconnect', handleDisconnect);
      adapter().on('error', handleError);
      return () => {
        adapter().off('connect', handleConnect);
        adapter().off('disconnect', handleDisconnect);
        adapter().off('error', handleError);
      };
    }
  });

  // When the adapter changes, disconnect the old one
  createEffect(() => {
    return () => {
      adapter()?.disconnect();
    };
  });

  // Connect the adapter to the wallet
  const connect = async (walletName: WhiteWalletName) => {
    if (connecting() || disconnecting() || connected()) {
      return;
    }
    const selectedWallet = wallets().find(
      (wAdapter) => wAdapter.adapter.name === walletName
    );

    const walletToConnect = selectedWallet
      ? {
        wallet: selectedWallet,
        adapter: selectedWallet.adapter,
        connected: selectedWallet.adapter.connected,
        account: selectedWallet.adapter.publicAccount,
        network: selectedWallet.adapter.network,
      }
      : initialState;
    console.log('wallet to connect', walletToConnect);

    if (!walletToConnect.adapter) {
      throw handleError(new WalletNotSelectedError());
    }

    if (
      !(
        walletToConnect.adapter.readyState === WalletReadyState.Installed ||
        walletToConnect.adapter.readyState === WalletReadyState.Loadable
      )
    ) {
      // Clear the selected wallet
      setName(props.localStorageKey, null);

      if (typeof window !== 'undefined' && walletToConnect.adapter.url) {
        window.open(walletToConnect.adapter.url, '_blank');
      }

      throw handleError(new WalletNotReadyError());
    }

    setConnecting(true);
    try {
      await walletToConnect.adapter.connect();
    } catch (error: any) {
      // Clear the selected wallet
      setName(props.localStorageKey, null);
      // Rethrow the error, and handleError will also be called
      throw error;
    } finally {
      setConnecting(false);
    }

    setWallet(selectedWallet);
    setAdapter(selectedWallet.adapter);
    setConnected(selectedWallet.adapter.connected);
    setAccount(selectedWallet.adapter.publicAccount);
    setNetwork(selectedWallet.adapter.network);
    setLastWallet(selectedWallet.adapter.name as WhiteWalletName);
  };

  // Disconnect the adapter from the wallet
  const disconnect = async () => {
    if (disconnecting()) return;
    if (!adapter()) return setName(props.localStorageKey, null);

    setDisconnecting(true);
    try {
      await adapter().disconnect();
    } catch (error: any) {
      // Clear the selected wallet
      setName(props.localStorageKey, null);
      // Rethrow the error, and handleError will also be called
      throw error;
    } finally {
      setDisconnecting(false);
    }
  };

  // Send a transaction using the provided connection
  const signAndSubmitTransaction = async (
    transaction: TransactionPayload,
    settings?: SwapSettings,
  ) => {
    const maxGasAmount = (settings?.maxGasFee || 20000) * 1; // TODO: Gas Unit
    const expirationTimestamp = (
      Math.floor(Date.now() / 1000) + (settings?.transactionDeadline || 30)
    ).toString();

    if (!adapter()) throw handleError(new WalletNotSelectedError());
    if (!connected()) throw handleError(new WalletNotConnectedError());

    const options = {
      max_gas_amount: maxGasAmount,
      expiration_timestamp_secs: expirationTimestamp,
    };

    if (adapter().name === 'BitKeep') {
      const signed = await adapter().signTransaction(transaction, options);
      const response = await aptosClient().submitSignedBCSTransaction(signed);
      return response;
    }

    const response = await adapter().signAndSubmitTransaction(transaction, options);
    return response;
  };

  const simulatePayload = async (
    // payload: TransactionPayload,
    payload: Types.EntryFunctionPayload,
  ) => {
    const simkeys: SimulationKeys = {
      pubkey: new HexString(adapter().publicAccount.publicKey.toString()),
      address: new HexString(adapter().publicAccount.address.toString()),
    };

    const result = await simulatePayloadTx(aptosClient(), simkeys, payload);
    return result;
  };

  const signTransaction = async (transaction: TransactionPayload) => {
    if (!adapter()) throw handleError(new WalletNotSelectedError());
    if (!connected()) throw handleError(new WalletNotConnectedError());
    return adapter().signTransaction(transaction);
  };

  if (lastWallet()) {
    connect(lastWallet() as WhiteWalletName);
  }

  return {
    wallets,
    wallet,
    adapter,
    account,
    connected,
    network,
    connecting,
    disconnecting,
    select: setName,
    connect,
    disconnect,
    signAndSubmitTransaction,
    signTransaction,
    simulatePayload,
  };
});
