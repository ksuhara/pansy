import { useWindowSize } from '@solid-primitives/resize-observer';
import { Link, useLocation } from '@solidjs/router';
import { RiSystemDashboardFill } from 'solid-icons/ri';
import { createSignal, For, type Component, type Setter } from 'solid-js';
import { useNetwork } from 'src/contexts/Network';
import { useAptosWallet } from 'src/contexts/WalletProvider';
import { isMobile } from 'src/utils/is-mobile';
import { ColorModeSwitchButton } from './ColorModeSwitch';
import { Modal } from './Modal';
import { SelectWallet } from './SelectWallet';
import { WalletButton } from './WalletButton';

const [showModal, setShowModal] = createSignal(false);

export const AppBar: Component<{
  setOpenGateKeep: Setter<boolean>
}> = (props) => {
  const location = useLocation();
  const { network } = useAptosWallet();
  const windowSize = useWindowSize();

  const { isOpenSelectWalletModal, closeSelectWalletModal } = useNetwork();

  const iconSize = 20;
  const links = () => [
    {
      label: 'Profile',
      href: '/profile',
      icon: <RiSystemDashboardFill size={iconSize} />,
    },
  ].flat();

  const LeftPart = () => (
    <div class="flex items-center gap-6">
      <div class='md:flex items-center'>
        <Link
          href="/"
          class="flex items-center no-underline text-black dark:text-white"
        >
          <div class="flex items-baseline flex-col -ml-2 -mt-0.5">
            <span class='ml-3 text-lg md:text-2xl font-bold'>
              Pansy
            </span>
          </div>
        </Link>
      </div>
      <For each={links()}>
        {({ label, href, icon }) => (
          <Link
            href={href}
            class={`no-underline hover:underline flex items-center gap-2
              ${location.pathname.startsWith(href)
            ? 'text-black dark:text-white'
            : 'text-gray-400 dark:text-gray-500'
          }`}
          >
            <span class='hidden lg:block mt-2'>
              {icon}
            </span>
            <span class='text-md font-bold'>
              {label}
            </span>
          </Link>
        )}
      </For>
    </div>
  );

  const RightPart = () => (
    <div>
      <div class="flex items-center gap-2 justify-end">
        <WalletButton text={isMobile() && 'Connect'} />
        <span class='hidden md:block aspect-squre'>
          <ColorModeSwitchButton />
        </span>
      </div>

      <Modal
        isOpen={isOpenSelectWalletModal()}
        onRequestClose={() => {
          closeSelectWalletModal();
        }}
      >
        <SelectWallet />
      </Modal>
    </div>
  );

  return (
    <nav class="sticky top-0 z-10 bg-slate-100 dark:bg-sea-900 py-4 md:px-12 flex justify-center">
      {/* <div class="w-[95vw] md:w-[1200px] grid grid-cols-3 items-center"> */}
      <div class="w-[95vw] md:w-[1200px] flex items-center items-center">
        <div class='flex-grow'>
          <LeftPart />
        </div>
        <RightPart />
      </div>
    </nav>
  );
};
