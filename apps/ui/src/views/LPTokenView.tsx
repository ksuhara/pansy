import { Link } from '@solidjs/router';
import { FaSolidTicketSimple } from 'solid-icons/fa';
import { For, Show, type Component } from 'solid-js';
import { LPTokenBalanceTable } from 'src/components/LPTokenBalanceTable';
import { useProfile } from 'src/contexts/Profile';
import type { PairAssets } from 'src/types/asset';
import { protocolBook } from 'umi-sdk';

export const LPTokenView: Component = () => {
  const { animeAssetList, pancakeAssetList, auxAssetList, pontemAssetList } = useProfile();

  const dataList = () => [
    {
      protocolProfile: protocolBook.aux,
      assets: auxAssetList,
    },
    {
      protocolProfile: protocolBook.pancake,
      assets: pancakeAssetList,
    },
    {
      protocolProfile: protocolBook.pontem,
      assets: pontemAssetList,
    },
    {
      protocolProfile: protocolBook.anime,
      assets: animeAssetList,
    },
  ];

  const ProtoView = (props: {
    proto: any
    assets: PairAssets[]
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
        <LPTokenBalanceTable assets={props.assets} />
      </div>
    </div>
  );

  return (
    <div class='box-balance-view-700'>
      <div class='flex items-center justify-between mb-1so'>
        <div class='header-balance-view'>
          <FaSolidTicketSimple size={24} />
          LP Token
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
                  <ProtoView proto={protocolProfile} assets={assets()}/>
                </div>
              </Show>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
};
