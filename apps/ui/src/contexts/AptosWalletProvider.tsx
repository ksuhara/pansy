
import { createContextProvider } from '@solid-primitives/context';
import { HexString } from 'aptos';
import { createEffect, createSignal } from 'solid-js';
import type { ActiveAptosWallet } from 'umi-sdk/src/types/aptos';
import { useAptosWallet } from './WalletProvider';

const hexStringV0ToV1 = (v0: any) => {
  if (typeof v0 === 'string') {
    return new HexString(v0);
  } else if (v0.hexString) {
    return new HexString(v0.toString());
  } else {
    throw new Error(`Invalid hex string object: ${v0}`);
  }
};

export const [AptosWalletProvider, useAptoWallet] = createContextProvider(props => {

  const { connected, account } = useAptosWallet();
  const [activeWallet, setActiveWallet] = createSignal<ActiveAptosWallet>(undefined);
  const [open, setOpen] = createSignal(false);

  createEffect(() => {
    if (connected && (account()?.address || account()?.publicKey)) {
      setActiveWallet(hexStringV0ToV1(account()?.address || account()?.publicKey));
    } else {
      setActiveWallet(undefined);
    }

    closeModal();
  });

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return {
    activeWallet,
    open,
    openModal,
    closeModal,
  };
});
