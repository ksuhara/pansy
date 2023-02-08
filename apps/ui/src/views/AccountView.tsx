
import { Link } from '@solidjs/router';
import type { MaybeHexString } from 'aptos';
import numeral from 'numeral';
import { FiExternalLink } from 'solid-icons/fi';
import { createMemo, For, Show, type Component } from 'solid-js';
import { CopyButton } from 'src/components/CopyButton';
import { Jazzicon, jsNumberForAddress } from 'src/components/Jazzicon';
import { aptosAccountExplorerList, suiAccountExplorerList } from 'src/config/explorerList';
import { useNetwork } from 'src/contexts/Network';
import { useProfile } from 'src/contexts/Profile';
import { truncate } from 'truncate-ethereum-address';
import type { Network } from '../config';

export const AddressPlate: Component<{
  text: MaybeHexString
  size: number
}> = (props) => {

  const { networkProfile, networkName } = useNetwork();

  const links = createMemo(() => {
    const accountAddress = props.text;
    if (networkProfile().chain === 'aptos') {
      return aptosAccountExplorerList({
        accountAddress,
        network: networkName(),
      });
    } else if (networkProfile().chain === 'sui') {
      return suiAccountExplorerList({
        accountAddress,
        network: networkName(),
      });
    }
    return [];
  });

  const AddressDisplay = () => (
    <div class='flex items-center ml-2'>
      <CopyButton
        class='text-sm text-black dark:text-white'
        displayText={truncate(props.text as string, { nPrefix: 8, nSuffix: 8 })}
        copyText={props.text as string}
      />
    </div>
  );

  const OtherLinks = () => (
    <div class='hidden md:flex flex-wrap items-cetner gap-1'>
      <For each={links()}>
        {({ label, logo, href }) => (
          <Link href={href} target="_blank">
            <button class='flex items-center gap-1 rounded-full px-2 py-0
            bg-slate-100 hover:bg-slate-200 border border-gray-200 dark:border-gray-700
            dark:bg-gray-800 dark:hover:bg-gray-700 transition duration-200'>
              <img src={logo} width={16} />
              <span> {label} </span>
              <FiExternalLink />
            </button>
          </Link>
        )}
      </For>
    </div>
  );

  return (
    <div class='flex items-center gap-3'>
      <div>
        <Jazzicon size={props.size} seed={jsNumberForAddress(props.text.toString())} />
      </div>
      <div class='flex flex-col gap-2'>
        <AddressDisplay />
        <OtherLinks />
      </div>
    </div>
  );
};

export const AccountView: Component = () => {
  const { profileAddress, totalMktValue } = useProfile();

  const network: Network = 'Mainnet';

  return (
    <div class='box-balance-view-700'>
      <div class='md:hidden mb-3'>
        <Show when={profileAddress()}>
          <AddressPlate text={profileAddress()} size={20} />
        </Show>
      </div>
      <div class='flex flex-wrap items-begin'>
        <div class='flex-grow'>
          <div class='text-md'>
            Net Worth
          </div>
          <div class='text-4xl font-bold'>
            $ {
              numeral(
                totalMktValue().toFixed()
              ).format('0,0.[00]').replaceAll(',', ' ')
            }
          </div>
        </div>
        <div class='hidden md:block'>
          <Show when={profileAddress()}>
            <AddressPlate text={profileAddress()} network={network} size={60} />
          </Show>
        </div>
      </div>
    </div>
  );
};
