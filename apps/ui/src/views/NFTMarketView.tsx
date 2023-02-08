
import { BiRegularCartAlt } from 'solid-icons/bi';
import { Show, type Component } from 'solid-js';
import { BalanceTable } from 'src/components/BalanceTable';
import { useProfile } from 'src/contexts/Profile';
import { protocolBook } from 'umi-sdk';

export const NFTMarketplaceView: Component = (props) => {

  const { marketplaces } = useProfile();

  const souffl3 = protocolBook.souffl3;

  const Souffl3View = () => (
    <div>
      <div class='flex items-center gap-3 text-lg font-medium mb-1so'>
        <img
          width={24}
          src={souffl3.logoURI}
          class="rounded-full"
        />
        <div>{souffl3.name}</div>
      </div>
      <div>
        <BalanceTable assets={marketplaces()} />
      </div>
    </div>
  );

  return (
    <div class='box-balance-view-700'>
      <div class='flex items-center justify-between mb-1so'>
        <div class='header-balance-view'>
          <BiRegularCartAlt size={24} />
          NFT Marketplace
        </div>
      </div>
      <div class='flex justify-center'>
        <Show
          when={marketplaces().length}
          fallback={<div> Not found </div>}
        >
          <Souffl3View />
        </Show>
      </div>
    </div>
  );
};
