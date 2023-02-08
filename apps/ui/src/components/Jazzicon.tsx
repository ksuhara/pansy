import jazzicon from '@metamask/jazzicon';
import type { Component } from 'solid-js';

export const jsNumberForAddress = (address: string): number => {
  const addr = address.slice(2, 10);
  const seed = parseInt(addr, 16);

  return seed;
};

export const Jazzicon: Component<{
  size: number,
  seed?: number,
}> = (props) => {
  return jazzicon(
    props.size,
    props.seed ?? Math.round(Math.random() * 10000000),
  );
};

