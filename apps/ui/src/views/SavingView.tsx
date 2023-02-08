import { Link } from '@solidjs/router';
import { RiFinanceBankCardFill } from 'solid-icons/ri';
import { For, Show, type Component } from 'solid-js';
import { BalanceTable } from 'src/components/BalanceTable';
import { useProfile } from 'src/contexts/Profile';
import type { Asset } from 'src/types/asset';
import { protocolBook } from 'umi-sdk';

export const SavingView: Component = () => {

  const { dittoAssetList } = useProfile();
  const { argoAssetList } = useProfile();
  const { tortugaAssetList } = useProfile();

  const dataList = () => [
    {
      protocolProfile: protocolBook.tortuga,
      assets: tortugaAssetList,
    },
    {
      protocolProfile: protocolBook.ditto,
      assets: dittoAssetList,
    },
    {
      protocolProfile: protocolBook.argo,
      assets: argoAssetList,
    },
  ];

  const ProtoView = (props: {
    proto: any
    assets: Asset[]
  }) => (
    <div>
      <Link
        href={props.proto.websites[0]}
        target="_blank"
        class="hover:underline"
      >
        <div class='flex items-center gap-3 text-lg font-medium mb-1so'>
          <img
            width={24}
            src={props.proto.logoURI}
            class="rounded-full"
          />
          <div>{props.proto.name}</div>
        </div>
      </Link>
      <div>
        <BalanceTable assets={props.assets} />
      </div>
    </div>
  );

  return (
    <div class='box-balance-view-700'>
      <div class='flex items-center justify-between mb-1so'>
        <div class='header-balance-view'>
          <RiFinanceBankCardFill size={24} />
          Saving
        </div>
      </div>
      <div>
        <Show
          fallback={<div> Not found </div>}
          when={dataList().some(({ assets }) => assets().length)}
        >
          <For each={dataList()}>
            {({ protocolProfile, assets }) => (
              <Show
                when={assets().length}
              >
                <div class='flex justify-center'>
                  <ProtoView proto={protocolProfile} assets={assets()} />
                </div>
              </Show>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
};
