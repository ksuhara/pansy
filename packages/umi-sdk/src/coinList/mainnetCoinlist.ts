import { DEFAULT_MAINNET_LIST } from '@manahippo/coin-list';
import { CoinProfile } from '../types';
import { biancneBook } from './binanceBook';
import { geckoBook } from './geckoBook';
import { logoBook } from './logoBook';
import { yfBook } from './yfbook';

const chainId = 1;

const hippo_list = DEFAULT_MAINNET_LIST.map(coin => {
  return {
    ...coin,
    chainId,
    address: coin.token_type.type,
    decimals: coin.decimals,
    name: coin.name,
    symbol: coin.symbol,
    official_symbol: coin.official_symbol,
    logoURI: logoBook[coin.symbol] ?? coin.logo_url,
    extensions: {
      projectURL: coin.project_url,
      // coingeckoId: coin.coingecko_id,
      coingeckoId: geckoBook[coin.official_symbol] ?? coin.coingecko_id,
      binaceSymbol: biancneBook[coin.official_symbol],
      ...yfBook[coin.official_symbol],
    }
  } satisfies CoinProfile;
});

export const mainnetCoinList: CoinProfile[] = [
  ...hippo_list
  // .filter(coin => coin.symbol !== 'APTOGE')
  ,
  // {
  //   chainId,
  //   address: '0x1::aptos_coin::AptosCoin',
  //   decimals: 8,
  //   name: 'Aptos Coin',
  //   symbol: 'APT',
  //   logoURI: 'https://pbs.twimg.com/profile_images/1556801889282686976/tuHF27-8_400x400.jpg',
  //   extensions: {
  //     coingeckoId: 'aptos',
  //     yfSymbol: 'APT21794-USD',
  //   }
  // },
  // {
  //   chainId,
  //   address: `${protocolBook.tortuga.modules().coins}::StakedAptosCoin`,
  //   decimals: 8,
  //   name: 'Tortuga Staked APT',
  //   symbol: 'tAPT',
  //   logoURI: tAPTLogo,
  //   extensions: {
  //     coingeckoId: 'aptos',
  //     yfSymbol: 'APT21794-USD',
  //   }
  // },
  // {
  //   chainId,
  //   address: `${protocolBook.argo.modules().usda}::USDA`,
  //   decimals: 6,
  //   name: 'Argo USD',
  //   symbol: 'USDA',
  //   logoURI: 'https://argo.fi/images/favicon.svg',
  //   extensions: {
  //     coingeckoId: 'dai',
  //     yfSymbol: 'DAI-USD',
  //   }
  // },
  // {
  //   chainId,
  //   address: `${protocolBook.ditto.modules().coins}::StakedAptos`,
  //   decimals: 8,
  //   name: 'Ditto Staked APT',
  //   symbol: 'stAPT',
  //   logoURI: stAPTLogo,
  //   extensions: {
  //     coingeckoId: 'aptos',
  //     yfSymbol: 'APT21794-USD',
  //   }
  // },
  // {
  //   ...measures.USDC,
  //   chainId,
  //   address: `${protocolBook.wormhole.modules().usdc}::T`,
  //   decimals: 6,
  //   name: 'Wormhole USDC',
  //   symbol: 'whUSDC',
  // },
  // {
  //   ...measures.USDT,
  //   chainId,
  //   address: `${protocolBook.wormhole.modules().usdt}::T`,
  //   decimals: 6,
  //   name: 'Wormhole USDT',
  //   symbol: 'whUSDT',
  // },
  // {
  //   ...measures.USDC,
  //   chainId,
  //   address: `${protocolBook.layerZero.modules().asset}::USDC`,
  //   decimals: 6,
  //   name: 'Layer Zero USDC',
  //   symbol: 'zUSDC',
  // },
  // {
  //   ...measures.USDT,
  //   chainId,
  //   address: `${protocolBook.layerZero.modules().asset}::USDT`,
  //   decimals: 6,
  //   name: 'Layer Zero USDT',
  //   symbol: 'zUSDT',
  // },
  // {
  //   ...measures.ETH,
  //   chainId,
  //   decimals: 6,
  //   address: `${protocolBook.layerZero.modules().asset}::WETH`,
  //   name: 'Layer Zero Wrapped ETH',
  //   symbol: 'zWETH',
  // },
];
