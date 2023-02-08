import { MaybeHexString } from 'aptos';
import { protocolBookMainnet } from './mainnet';
import { protocolBookTestnet } from './testnet';

export enum DexType {
  Hippo = 1,
  Econia = 2,
  Pontem = 3,
  Basiq = 4,
  Ditto = 5,
  Tortuga = 6,
  Aptoswap = 7,
  Aux = 8,
  Anime = 9,
  Cetus = 10,
  Pancake = 11,
  Obric = 12,
}

export const findProtocolByName = (protocolName: ProtocolName) => {
  return protocolBook[protocolName]
};

export const protocolAddressBook = () => {
  // if (isTestnet()) {
  //   return protocolBookTestnet;
  // }

  return protocolBookMainnet;
};

export const protocolNameList = [
  'umi',
  'anime',
  'aptin',
  'aptoswapnet',
  'argo',
  'aux',
  'basiq',
  'bluemove',
  'cetus',
  'econia',
  'ditto',
  'hippo',
  'layerzero',
  'mobius',
  'obric',
  'pancake',
  'pontem',
  'souffl3',
  'topaz',
  'tortuga',
  'tsunami',
  'vial',
  'wormhole',
] as const

export type ProtocolName = typeof protocolNameList[number]

interface ProtocolInfo {
  name: ProtocolName
  websites?: string[]
  description?: string
  logoURI: string
  extensions?: {
    twitter?: string
    telegram?: string
  }
  accounts?: () => Record<string, MaybeHexString>
  // modules?: () => Record<string, string>
  // structs?: () => Record<string, string>
}

export const protocolBook: Record<ProtocolName, ProtocolInfo> = {
  umi: {
    name: 'Umi',
    websites: [
      'https://umi.ag',
    ],
    description: 'Umi protocol is a smart AMM built on Aptos with an automated concentrated liquidity algorithm and swap aggregation engine.',
    logoURI: 'https://pbs.twimg.com/profile_images/1564436173149585409/GQls_-wL_400x400.jpg',
    extensions: {
      twitter: 'https://twitter.com/umi_protocol',
      telegram: 'https://t.me/umi_ag',
    },
    accounts: () => protocolAddressBook().umi.accounts,
    modules: () => protocolAddressBook().umi.modules,
  },
  hippo: {
    name: 'HippoLabs',
    websites: [
      'https://hippo.space',
    ],
    logoURI: 'https://pbs.twimg.com/profile_images/1559972613694361605/T9d05Dkd_400x400.jpg',
    extensions: {
      twitter: 'https://mobile.twitter.com/hippolabs__',
    },
    accounts: () => protocolAddressBook().hippo.accounts,
    modules: () => protocolAddressBook().hippo.modules,
  },
  argo: {
    name: 'Argo.fi',
    websites: [
      'https://argo.fi',
    ],
    description: 'Bringing $USDA, a decentralized stablecoin, to Aptos.',
    logoURI: 'https://argo.fi/images/favicon.svg',
    extensions: {
      twitter: 'https://twitter.com/ArgoUSD',
    },
    accounts: () => protocolAddressBook().argo.accounts,
    modules: () => protocolAddressBook().argo.modules,
    structs: () => protocolAddressBook().argo.structs,
  },
  aptoswapnet: {
    name: 'Aptoswap',
    websites: [
      'https://aptoswap.net',
    ],
    logoURI: 'https://pbs.twimg.com/profile_images/1579498446746066944/9yptS80V_400x400.jpg',
    extensions: {
      twitter: 'https://twitter.com/aptoswap_net',
    },
    accounts: () => protocolAddressBook().aptoswapnet.accounts,
    modules: () => ({}),
    structs: () => protocolAddressBook().aptoswapnet.structs,
  },
  anime: {
    name: 'AnimeSwap',
    websites: [
      'https://animeswap.org',
    ],
    logoURI: 'https://pbs.twimg.com/profile_images/1555058896020340736/nr5Lx5tQ_400x400.jpg',
    extensions: {
      twitter: 'https://twitter.com/animeswap_org',
    },
    accounts: () => protocolAddressBook().anime.accounts,
    modules: () => protocolAddressBook().anime.modules,
    structs: () => protocolAddressBook().anime.structs,
  },
  pontem: {
    name: 'Pontem',
    websites: [
      'https://liquidswap.com',
    ],
    logoURI: 'https://avatars.githubusercontent.com/u/79349007?s=200&v=4',
    extensions: {
      twitter: 'https://twitter.com/PontemNetwork'
    },
    accounts: () => protocolAddressBook().pontem.accounts,
    modules: () => protocolAddressBook().pontem.modules,
    structs: () => protocolAddressBook().pontem.structs,
  },
  aptin: {
    name: 'Aptin',
    websites: [
      'https://aptin.io',
    ],
    description: 'First lending protocol on #Aptos. Devnet platform launched!',
    logoURI: 'https://pbs.twimg.com/profile_images/1557562892060266496/bdFIy5al_400x400.jpg',
    extensions: {
      twitter: 'https://twitter.com/aptinlabs',
    },
    accounts: () => protocolBookTestnet.aptin.accounts,
    modules: () => protocolBookTestnet.aptin.modules,
  },
  vial: {
    name: 'Vial',
    websites: [
      'https://vial.fi'
    ],
    description: 'Permissionlessly deposit collateral & borrow assets on #Aptos.',
    logoURI: 'https://pbs.twimg.com/profile_images/1541993704344395776/DHzezz0s_400x400.png',
    extensions: {
      twitter: 'https://twitter.com/vialprotocol',
    },
    accounts: () => protocolBookTestnet.vial.accounts,
    modules: () => protocolBookTestnet.vial.modules,
  },
  mobius: {
    name: 'Mobius',
    websites: [
      'https://mobius.market'
    ],
    description: 'Decentralized non-custodial liquidity market protocol on #Aptos.',
    logoURI: 'https://pbs.twimg.com/profile_images/1554071514449711105/DJE412ze_400x400.jpg',
    extensions: {
      twitter: 'https://twitter.com/protocol_mobius',
    },
    accounts: () => protocolBookTestnet.mobius.accounts,
    modules: () => protocolBookTestnet.mobius.modules,
  },
  souffl3: {
    name: 'Souffl3',
    websites: [
      'https://souffl3.com/'
    ],
    description: 'Nextgen smart trading NFT market.',
    logoURI: 'https://pbs.twimg.com/profile_images/1541969767044886528/nC6kYlIk_400x400.jpg',
    extensions: {
      twitter: 'https://twitter.com/nft_souffl3',
    },
  },
  topaz: {
    name: 'Topaz',
    websites: [
      'https://www.topaz.so/'
    ],
    description: 'The premiere NFT marketplace, built on #Aptos.',
    logoURI: 'https://pbs.twimg.com/profile_images/1577826551269363712/sDsEXbYR_400x400.png',
    extensions: {
      twitter: 'https://twitter.com/TopazMarket',
    }
  },
  bluemove: {
    name: 'BlueMove',
    websites: [
      'https://bluemove.net'
    ],
    description: 'The leading multi-chain NFT marketplace on #Aptos.',
    logoURI: 'https://pbs.twimg.com/profile_images/1557643346528862209/QfC9MZQ-_400x400.png',
    extensions: {
      twitter: 'https://twitter.com/BlueMoveNFT',
    }
  },
  tortuga: {
    name: 'Tortuga Finance',
    websites: [
      'https://tortuga.finance/'
    ],
    description: 'Liquid Staking on @AptosLabs. Use $tAPT anywhere.',
    logoURI: 'https://pbs.twimg.com/profile_images/1558163065685905408/zFN8e4Tg_400x400.jpg',
    extensions: {
      twitter: 'https://twitter.com/TortugaFinance',
    },
    accounts: () => protocolAddressBook().tortuga.accounts,
    modules: () => protocolAddressBook().tortuga.modules,
  },
  tsunami: {
    name: 'TsunamiFinance',
    websites: [
      'https://tsunami.finance/'
    ],
    description: 'Trade spot & perpetuals with 0% slippage. Get 30x leverage on @AptosLabs & access to liquid sustainable yields.',
    logoURI: 'https://pbs.twimg.com/profile_images/1583585786225647619/AbCt4Mhh_400x400.jpg',
    extensions: {
      twitter: 'https://twitter.com/TsunamiFinance_',
    },
  },
  econia: {
    name: 'Econia',
    websites: [
      'https://www.econia.dev/'
    ],
    description: 'Econia’s hyper-parallelized on-chain order book for the Aptoslabs blockchain.',
    logoURI: 'https://pbs.twimg.com/profile_images/1563306565280493569/OD15zxYC_400x400.jpg',
    extensions: {
      twitter: 'https://twitter.com/EconiaLabs',
    },
  },
  basiq: {
    name: 'BasiQ',
    description: 'BasiQ Protocol is a new generation of proactive liquidity AMM built on @AptosLabs,use an external oracle to provide the current “fair price”.',
    logoURI: 'https://pbs.twimg.com/profile_images/1567087307924324355/pxLY4M2e_400x400.jpg',
    extensions: {
      twitter: 'https://twitter.com/BasiQProtocol',
    },
  },
  cetus: {
    name: 'Cetus',
    websites: [
      'https://cetus.zone'
    ],
    description: `A Pioneer DEX and Concentrated Liquidity Protocol Built on #Aptos and #Sui LIVE on Aptos Mainnet: http://app.cetus.zone Earn XP👉http://cetusprotocol.crew3.xyz/questboard`,
    logoURI: "https://pbs.twimg.com/profile_images/1554421146854264833/qvA0U4Js_400x400.jpg",
    extensions: {
      twitter: 'https://twitter.com/CetusProtocol',
    },
    accounts: () => protocolAddressBook().cetus.accounts,
    modules: () => protocolAddressBook().cetus.modules,
    structs: () => protocolAddressBook().cetus.structs,
  },
  ditto: {
    name: 'Ditto',
    websites: [
      'https://www.dittofinance.io/'
    ],
    description: 'The liquid staking solution for #Aptos.',
    logoURI: 'https://pbs.twimg.com/profile_images/1609675178044276743/V-V1Ju3Q_400x400.jpg',
    extensions: {
      twitter: 'https://twitter.com/Ditto_Finance',
    },
    accounts: () => protocolAddressBook().ditto.accounts,
    modules: () => protocolAddressBook().ditto.modules,
  },
  pancake: {
    name: 'Pancake',
    websites: [
      'https://pancakeswap.finance',
    ],
    description: 'Trade. Earn. Win. NFT.',
    logoURI: 'https://pbs.twimg.com/profile_images/1613834535476535297/PSiAEax7_400x400.jpg',
    extensions: {
      twitter: 'https://twitter.com/pancakeswap',
    },
    accounts: () => protocolAddressBook().pancake.accounts,
    modules: () => protocolAddressBook().pancake.modules,
    structs: () => protocolAddressBook().pancake.structs,
  },
  aux: {
    name: 'Aux',
    websites: [
      'https://aux.exchange/'
    ],
    description: 'AUX is the universal exchange. Our mission is to provide the best decentralized trading experience possible.',
    logoURI: 'https://pbs.twimg.com/profile_images/1582023629923049473/mriNeYAL_400x400.jpg',
    extensions: {
      twitter: 'https://twitter.com/AuxExchange',
    },
    accounts: () => protocolAddressBook().aux.accounts,
    modules: () => protocolAddressBook().aux.modules,
    structs: () => protocolAddressBook().aux.structs,
  },
  obric: {
    name: "Obric",
    websites: [
    ],
    description: "Just too poor to pay gas on @aptos_network Wanna hear some broke bloke’s story? 🙊👉 http://discord.gg/TNXY8Xd7bH  Effective Poorism",
    logoURI:'https://pbs.twimg.com/profile_images/1590619509370802177/qNWMZ029_400x400.jpg',
    accounts: () => protocolAddressBook().obric.accounts,
    modules: () => protocolAddressBook().obric.modules,
    structs: () => protocolAddressBook().obric.structs,
    extensions: {
      twitter: 'https://twitter.com/poor_obric',
    },
  },
  wormhole: {
    name: 'Wormhole',
    logoURI: 'https://pbs.twimg.com/profile_images/1535292066397409280/r-5azuJ__400x400.jpg',
    modules: () => protocolAddressBook().wormhole.modules,
  },
  layerzero: {
    name: 'Layer Zero',
    logoURI: 'https://pbs.twimg.com/profile_images/1438201026960506881/ftxG9_TJ_400x400.jpg',
    modules: () => protocolAddressBook().layerZero.modules,
  },
};
