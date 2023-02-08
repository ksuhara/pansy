import { fetchAnimeSwapPools } from './protocols/anime/poolList';
import { fetchAptoswapnetPools } from './protocols/aptoswapnet/poolList';
import { fetchAuxPools } from './protocols/aux/poolList';
import { fetchCetusPools } from './protocols/cetus/poolList';
import { fetchObricPools } from './protocols/obric/poolList';
import { fetchPancakePools } from './protocols/pancake/poolList';
import { fetchPontemPools } from './protocols/pontem/poolList';

export { fetchAnimeSwapPools } from './protocols/anime/poolList';
export { fetchAptoswapnetPools } from './protocols/aptoswapnet/poolList';
export { fetchAuxPools } from './protocols/aux/poolList';
export { fetchCetusPools } from './protocols/cetus/poolList';
export { fetchObricPools } from './protocols/obric/poolList';
export { fetchPancakePools } from './protocols/pancake/poolList';
export { fetchPontemPools } from './protocols/pontem/poolList';

export const fetchPools = () => Promise
  .all([
    fetchPontemPools(),
    fetchAptoswapnetPools(),
    fetchAnimeSwapPools(),
    fetchAuxPools(),
    fetchCetusPools(),
    fetchPancakePools(),
    fetchObricPools(),
  ])
  .then(p => p.flat())
  // ignore null
  .then(p => p.filter(pp => !!pp));
