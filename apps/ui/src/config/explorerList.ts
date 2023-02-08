
// https://explorer.sui.io/
// https://suiscan.xyz/

import type { MaybeHexString } from 'aptos';
import type { NetworkName } from './networkList';

export const aptosAccountExplorerList = (props: {
  accountAddress: MaybeHexString,
  network: NetworkName,
}) => {
  return [
    {
      label: 'explorer',
      // href: `https://explorer.aptoslabs.com/account/${props.acocuntAddress}?network=${props.network}`,
      href: `https://explorer.aptoslabs.com/account/${props.accountAddress}`,
      logo: 'https://explorer.aptoslabs.com/favicon.ico',
    },
    {
      label: 'aptoscan',
      href: `https://aptoscan.xyz/account/${props.accountAddress}`,
      logo: 'https://aptoscan.xyz/aptos.svg',
    },
    {
      label: 'tracemove',
      href: `https://tracemove.io/account/${props.accountAddress}`,
      logo: 'https://www.nodereal.io/static/aptos-trace/favicon.ico',
    },
  ];
};

export const suiAccountExplorerList = (props: {
  accountAddress: MaybeHexString,
  network: NetworkName,
}) => {
  return [
    {
      label: 'explorer',
      href: `https://explorer.sui.io/addresss/${props.accountAddress}`,
      logo: 'https://explorer.sui.io/favicon32x32.png',
    },
  ];
};
