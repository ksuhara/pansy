import { createContextProvider } from '@solid-primitives/context';
import { createStorageSignal } from '@solid-primitives/storage';
import { protocolBook as SuiProtocolBook } from '@umi-ag/sui-sdk';
import { createEffect, createMemo, createSignal } from 'solid-js';
import type { NetworkName } from 'src/config/networkList';
import { NetworkBook } from 'src/config/networkList';
import { match } from 'ts-pattern';
import type { ProtocolName } from 'umi-sdk';
import { protocolBook as AptosProtcolBook } from 'umi-sdk';
import { useAptosWallet } from './WalletProvider';

export const [NetworkProvider, useNetwork] = createContextProvider(() => {
  const aptos = useAptosWallet();

  const [networkName, setNetworkName] = createStorageSignal<NetworkName>(
    'network-name',
    'AptosMainnet',
  );

  const networkProfile = createMemo(() => NetworkBook[networkName()]);

  const [isOpenSelectWalletModal, setIsOpenSelectWalletModal] = createSignal(true);

  const openSelectWalletModal = () => { setIsOpenSelectWalletModal(true); };
  const closeSelectWalletModal = () => { setIsOpenSelectWalletModal(false); };

  const connected = createMemo(() => {
    return aptos.connected();
  });

  const accountAddress = createMemo(() => {
    if (connected()) {
      return aptos.account()?.address;
    } else {
      return null;
    }
  });

  const disconnect = async () => {
    console.log('disconnect wallet');
    await aptos.disconnect();
  };

  const connectedWalletIcon = createMemo(() => {
    return aptos.adapter()?.icon;
  });

  createEffect(() => {
    aptos.connecting();
    closeSelectWalletModal();
  });

  const changeNetwork = async (networkName: NetworkName) => {
    setNetworkName(networkName);
    await disconnect();
  };

  const protocolBook = createMemo(() => {
    return match(networkProfile().chain)
      .with('aptos', () => AptosProtcolBook)
      .with('sui', () => SuiProtocolBook)
      .exhaustive();
  });

  const findProtocolByName = (protocolName: ProtocolName) => {
    return protocolBook()[protocolName];
  };

  return {
    networkName,
    changeNetwork,
    networkProfile,
    isOpenSelectWalletModal, openSelectWalletModal, closeSelectWalletModal,
    accountAddress,
    connected, disconnect,
    connectedWalletIcon,
    protocolBook,
    findProtocolByName,
  };
});
