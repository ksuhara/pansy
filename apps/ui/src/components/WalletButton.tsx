import { Link } from '@solidjs/router';
import { BiSolidWalletAlt } from 'solid-icons/bi';
import { VsDebugDisconnect } from 'solid-icons/vs';
import type { Component, Setter } from 'solid-js';
import { createSignal, Match, Show, Switch } from 'solid-js';
import { useNetwork } from 'src/contexts/Network';
import { getOmitAddress } from 'src/utils/web3';
import { useFirebase } from '../plugins/firebase';
import { Jazzicon, jsNumberForAddress } from './Jazzicon';
import { Modal } from './Modal';

export const MobileWalletModal: Component<{
  show: boolean
  setShow: Setter<boolean>
}> = (props) => {
  const { disconnect } = useNetwork();
  return (
    <Modal isOpen={Boolean(props.show)} onRequestClose={() => props.setShow(null)}>
      <div class='p-10 bg-slate-50 dark:bg-sea-700 rounded-xl'>
        <button
          class='flex items-center gap-1 px-3 py-2 text-black dark:text-gray-700 bg-red-300 hover:bg-red-400 rounded-xl'
          onClick={() => {
            disconnect();
          }}
        >
          <VsDebugDisconnect size={24} />
          Disconnect wallet
        </button>
      </div>
    </Modal>
  );
};

export const WalletButton: Component<{
  text?: string;
  class?: string;
}> = (props) => {
  const { accountAddress, connected, connectedWalletIcon, openSelectWalletModal } = useNetwork();
  const { ga } = useFirebase();

  const MobileWalletButton = () => {

    const [openMobileModal, setOpenMobileModal] = createSignal(false);
    return (
      <>
        <button
          class='wallet-button-connected text-xs px-2 py-1 border border-lightdark rounded-full flex items-center gap-1'
          onclick={() => {
            if (connected) {
              setOpenMobileModal(true);
            }
          }}
        >
          <img
            src={connectedWalletIcon()}
            width={24}
            class='rounded'
          />
          {getOmitAddress(accountAddress())}
        </button>
        <MobileWalletModal show={openMobileModal()} setShow={setOpenMobileModal} />
      </>
    );
  };

  const DesktopWalletButton = () => (
    <Link
      href="/profile"
      class={`
        no-underline flex items-center gap-2
        ${location.pathname.startsWith('/about') ? 'text-white' : 'text-gray-500'}
      `}
    >
      <button
        class='wallet-button-connected text-sm px-2 py-1 border border-lightdark flex items-center gap-2'
      >
        <Jazzicon size={24} seed={jsNumberForAddress(accountAddress() as string)} />
        {getOmitAddress(accountAddress())}
        <img
          src={connectedWalletIcon()}
          width={24}
          class='rounded'
        />
      </button>
    </Link>
  );

  return (
    <Switch>
      <Match when={accountAddress()}>
        <div class='hidden md:block'>
          <DesktopWalletButton />
        </div>
        <div class='md:hidden'>
          <MobileWalletButton />
        </div>
      </Match>
      <Match when={!connected()}>
        <button
          class={
            props.class ??
            'text-sm px-3 py-2 wallet-button'
          }
          onClick={() => {
            openSelectWalletModal();
            ga.logEvent('click_wallet_button');
          }}
        >
          <div class='flex justify-center items-center gap-1 text-black'>
            <BiSolidWalletAlt />
            <Show
              fallback="Connect Wallet"
              when={props.text}
            >
              {props.text}
            </Show>
          </div>
        </button>
      </Match>
    </Switch>
  );
};
