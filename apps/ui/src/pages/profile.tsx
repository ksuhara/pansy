import { Link, useLocation, useNavigate, useParams } from '@solidjs/router';
import { createEffect, Match, Show, Switch } from 'solid-js';
import { AddressInput } from 'src/components/AddressInput';
import { DisconnectButton } from 'src/components/DisconnectButton';
import { WalletButton } from 'src/components/WalletButton';
import { useNetwork } from 'src/contexts/Network';
import { useProfile } from 'src/contexts/Profile';
import { isMobile } from 'src/utils/is-mobile';
import { AccountView } from 'src/views/AccountView';
import { LendingView } from 'src/views/LendingView';
import { LPTokenView } from 'src/views/LPTokenView';
import { NFTMarketplaceView } from 'src/views/NFTMarketView';
import { PieView } from 'src/views/PieView';
import { SavingView } from 'src/views/SavingView';
import { WalletAssetView } from 'src/views/WalletAssetView';
import { profileDemoAddress } from '../config';

const GreetingPart = () => {
  return (
    <p class="text-center dark:text-white text-lg md:text-2xl mb-6 md:mb-8">
      <span class='font-bold text-greenblue-dark'>
        Entry Point to Aptos Ecosystem
      </span>
    </p>
  );
};

const isDemoPage = () => useLocation().pathname.startsWith(`/profile/${profileDemoAddress}`);

const ViewDemoButton = () => {
  const message = () => isDemoPage()
    ? 'This Page is Demo'
    : 'View Demo';

  return (
    <Link href={
      (() => {
        return `/profile/${profileDemoAddress}`;
      })()
    }>
      <button class='view-demo-button shadow-md hover:shadow-cyan-300 px-3 py-2 text-gray-800 dark:text-white font-medium'>
        {message()}
      </button>
    </Link>
  );
};

const ViewDemoButtonAndConnectWalletButtonPart = () => {
  const { accountAddress, disconnect, connected } = useNetwork();
  const params = useParams();
  const { profileAddress, setProfileAddress } = useProfile();

  const getWalletAddress = () => connected() && accountAddress();
  createEffect(() => setProfileAddress(params.address ?? getWalletAddress() ?? ''));
  createEffect(() => console.log('profile', profileAddress()));

  return (
    <Switch fallback={
      <div class='flex justify-center items-center gap-8'>
        <ViewDemoButton />
        <div class='text-gray-700 dark:text-gray-200 text-lg font-bold'> OR </div>
        <WalletButton />
      </div>
    }>
      <Match when={connected() && isMobile()}>
        <div class='flex'>
          <div class='flex-grow' />
          <div class='flex items-center gap-5'>
            <ViewDemoButton />
          </div>
        </div>
      </Match>
      <Match when={connected()}>
        <div class='flex'>
          <div class='flex-grow' />
          <div class='flex items-center gap-5'>
            <ViewDemoButton />
            <WalletButton />
            <DisconnectButton />
          </div>
        </div>
      </Match>
      <Match when={isDemoPage()}>
        <div class='flex'>
          <div class='flex-grow' />
          <div class='flex items-center gap-5'>
            <ViewDemoButton />
            <WalletButton />
          </div>
        </div>
      </Match>
    </Switch>

  );
};

const Page = () => {
  const { accountAddress, disconnect, connected } = useNetwork();
  const params = useParams();
  const { profileAddress, setProfileAddress } = useProfile();
  const navigate = useNavigate();

  const getWalletAddress = () => connected() && accountAddress();
  createEffect(() => setProfileAddress(params.address || getWalletAddress() || ''));
  createEffect(() => console.log('profile', profileAddress()));

  createEffect(() => {
    if (accountAddress()) {
      navigate(`/profile/${accountAddress()}`);
    }
  });

  return (
    <div class='grid items-center p-1 md:p-4 w-screen'>
      <GreetingPart />
      <section class="dark:text-gray-500 font-normal flex justify-center">
        <div class='
          w-[98vw] max-w-[1200px]
          flex flex-col gap-3 md:gap-6 p-2 md:p-4
        '>

          <AddressInput onEnter={address => navigate(`/profile/${address}`)} />

          <ViewDemoButtonAndConnectWalletButtonPart />

          <Show when={profileAddress()}>
            <AccountView />
            <PieView />
            <WalletAssetView />
            <LendingView />
            <SavingView />
            <LPTokenView />
            <NFTMarketplaceView />
          </Show>
        </div>
      </section>
    </div>
  );
};

export default Page;
