import { BiSolidWalletAlt } from 'solid-icons/bi';
import type { Component } from 'solid-js';
import { Match, Switch } from 'solid-js';
import { BalanceTable } from 'src/components/BalanceTable';
import { useProfile } from 'src/contexts/Profile';

export const WalletAssetView: Component<{
}> = (props) => {
  const { walletAssetList } = useProfile();

  return (
    <div class='box-balance-view-700'>
      <div class='header-balance-view'>
        <BiSolidWalletAlt size={24} />
        Wallet
      </div>
      <Switch fallback={
        <div> Not found </div>
      }>
        <Match when={walletAssetList().length}>
          <div class='flex justify-center'>
            <BalanceTable assets={walletAssetList()} />
          </div>
        </Match>
      </Switch>
    </div>
  );
};

