import type { Component } from 'solid-js';
import { For } from 'solid-js';

export const CoinLogo: Component<{
  logoURIs: string[]
  size: number
}> = (props) => {
  return (
    <div class='flex items-center'>
      <For each={props.logoURIs}>
        {logoURI => (
          <img
            src={logoURI}
            width={props.size}
            class='rounded-full'
          />
        )}
      </For>
    </div>
  );
};
