import { Link } from '@solidjs/router';
import { For, Match, Show, Switch, type Component } from 'solid-js';
import { installationURI } from 'src/config/walletList';
import { useNetwork } from 'src/contexts/Network';
import { useAptosWallet } from 'src/contexts/WalletProvider';
import type { WhiteWalletName } from 'umi-sdk/src/types/wallet';

const SelectAptosWallet = () => {
  const { wallets, connect } = useAptosWallet();

  return (
    <div class='flex justify-center'>
      <div class='w-80 box-lightdark-700'>
        <div class='p-5'>
          <div class='text-black dark:text-white flex items-center justify-between'>
            <div>
              Select your wallet
            </div>
          </div>
        </div>
        <div class='w-full h-0.4 bg-gray-200 dark:bg-sea-800' />
        <div class='overflow-y-auto h-60vh'>
          <For each={wallets()}>
            {wallet => (
              <div
                class='text-black dark:text-white flex items-center bg-white hover:bg-slate-200 dark:bg-sea-700 dark:hover:bg-sea-800 min-w-full'
              >
                <button
                  class='py-2 px-4 flex items-center gap-5 flex-grow'
                  onClick={async () => {
                    await connect(wallet.adapter.name as WhiteWalletName);
                  }}
                >
                  <img
                    src={wallet.adapter.icon}
                    width={32}
                    class='rounded'
                  />
                  {wallet.adapter.name}
                </button>
                <div>
                  <Show when={installationURI[wallet.adapter.name]}>
                    <Link
                      href={installationURI[wallet.adapter.name]}
                      target="_blank"
                    >
                      <button
                        // text-white bg-blue-500 hover:bg-blue-400
                        class="text-sm
                        text-white bg-blue-600 hover:bg-blue-500
                        py-1 px-2 mr-3 rounded-lg"
                      >
                        install
                      </button>
                    </Link>
                  </Show>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

export const SelectWallet: Component<{
}> = (props) => {
  const { networkProfile } = useNetwork();

  return (
    <Switch>
      <Match when={networkProfile().chain === 'aptos'}>
        <SelectAptosWallet />
      </Match>
    </Switch>
  );
};
