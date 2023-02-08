export enum DexType {
  hippo = 1,
  econia = 2,
  pontem = 3,
  basiq = 4,
  Ditto = 5,
  Tortuga = 6,
  Aptoswap = 7,
  Aux = 8,
}

export const protocolBookTestnet = {
  umi: {
    accounts: {
      aggregator: '0x4b6806f7563f2d9bac0fb4da0924ea6fac049e2148f01b9d6ef8eed9a226fb19',
    },
    modules: {
      pool: '0x1f066433a03ccf70f7bee92b4f79470a373ce07173194fdfdb7ebf7bea2aad52::pool',
      coins: '0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68::devnet_coins',
      aggregator: '0xbeaa9e5ef5bee0781476a4adf293aae7dc3a28e9bd79fda89fca7211fb94c80::aggregator',
      devnet: '0x4b6806f7563f2d9bac0fb4da0924ea6fac049e2148f01b9d6ef8eed9a226fb19::devnet',
      testnet: '0xbeaa9e5ef5bee0781476a4adf293aae7dc3a28e9bd79fda89fca7211fb94c80::devnet',
    },
  },
  hippo: {
    accounts: {
      pool: '0x46e159be621e7493284112c551733e6378f931fd2fc851975bc36bedaae4de0f',
    },
    modules: {
      coins: '0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68::devnet_coins',
      cp_swap: '0x46e159be621e7493284112c551733e6378f931fd2fc851975bc36bedaae4de0f::cp_swap',
      aggregator: '0xdad1c1d54fcff3bf0d83b4b0067d7cf0ebdca3ff17556f77115ada2db1ff23fe::aggregator',
      devnet: '0xdad1c1d54fcff3bf0d83b4b0067d7cf0ebdca3ff17556f77115ada2db1ff23fe::devnet',
    },
  },
  argo: {
    accounts: {
      type: '0x98298d34bcf896c663e069c464754e0cfd36b50e21eedd8db0e4189168057cb7',
      vault: '0xa0a017f8d8a695731dcdb8bf27e2da141da68785b347aaa5b87c5e0fa4332222',
    },
    modules: {
      usda: '0x1000000f373eb95323f8f73af0e324427ca579541e3b70c0df15c493c72171aa::usda',
      engine: '0xeeee1a806419e21235f02690f3ea0d52c3c057fdeaa498a43976f128acbcaaaa::engine_v1',
      namespace: '0xaaaa0f21b8a1bd01feba0b7ca3df18ce7b9dd50394ef25f5b115c6612c73aaaa::namespace',
    },
  },
  aptoswapnet: {
    accounts: {
      exchange: '0xa5d3ac4d429052674ed38adc62d010e52d7c24ca159194d17ddc196ddb7e480b',
    },
    structs: {
      Pool: '0xa5d3ac4d429052674ed38adc62d010e52d7c24ca159194d17ddc196ddb7e480b::pool::Pool'
    },
  },
  anime: {
    accounts: {
      pool: '0xe73ee18380b91e37906a728540d2c8ac7848231a26b99ee5631351b3543d7cf2',
      _pool: '0x16fe2df00ea7dde4a63409201f7f4e536bde7bb7335526a35d05111e68aa322c',
    },
    modules: {
      pool: '0xe73ee18380b91e37906a728540d2c8ac7848231a26b99ee5631351b3543d7cf2::AnimeSwapPoolV1',
      coins: '0x16fe2df00ea7dde4a63409201f7f4e536bde7bb7335526a35d05111e68aa322c::TestCoinsV1',
    },
    structs: {
      LiquidityPool: '0xe73ee18380b91e37906a728540d2c8ac7848231a26b99ee5631351b3543d7cf2::AnimeSwapPoolV1::LiquidityPool',
    },
  },
  pontem: {
    accounts: {
      // pool: '0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9',
      pool: '0x8aa500cd155a6087509fa84bc7f0deed3363dd253ecb62b2f110885dacf01c67',
    },
    modules: {
      // pool: '0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9::liquidity_pool',
      // lp: '0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9::lp',
      // coins: '0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9::coins',
      pool: '0x4e9fce03284c0ce0b86c88dd5a46f050cad2f4f33c4cdd29d98f501868558c81::liquidity_pool',
      lp: '0x4e9fce03284c0ce0b86c88dd5a46f050cad2f4f33c4cdd29d98f501868558c81::lp',
      coins: '0x4e9fce03284c0ce0b86c88dd5a46f050cad2f4f33c4cdd29d98f501868558c81::coins',
      curves: '0x4e9fce03284c0ce0b86c88dd5a46f050cad2f4f33c4cdd29d98f501868558c81::curves'
    },
    structs: {
      LiquidityPool: '0x4e9fce03284c0ce0b86c88dd5a46f050cad2f4f33c4cdd29d98f501868558c81::liquidity_pool::LiquidityPool',
    }
  },
  aptin: {
    accounts: {
      vault: '0x93bb93f633ad80fedd608b36c846f70b54ced5c6140fd3eca227e4eeb3f3206a',
    },
    modules: {
      vcoins: '0x8e8eab429ac727b023d72fdb51e7accbf76fb1f5d5b087c49246e760c8f08493::vcoins',
    },
  },
  vial: {
    accounts: {},
    modules: {},
  },
  mobius: {
    accounts: {},
    modules: {},
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
    }
  },
  topaz: {
    extensions: {
      twitter: 'https://twitter.com/TopazMarket',
    }
  },
  bluemove: { },
  tortuga: {
    accounts: {
      pool: '0x84d7aeef42d38a5ffc3ccef853e1b82e4958659d16a7de736a29c55fbbeb0114',
    },
    modules: {
      router: '0x3cf126fc1e6066d7c7841d998be87b432f27ddbab2ef9cc8c2172800c70e9aae::stake_router',
      coins: '0x2f37694be6350f94bbd49e2e87bafd85c79096dcdb155f3071b2fd2a02ac0e2c::staked_aptos_coin'
    }
  },
  ditto: {
    accounts: {
      pool: '0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5',
    },
    modules: {
      coins: '', // TODO: remove this line
    },
  },
  wormhole: {
    modules: {
      usdc: '', // TODO: remove this line
      usdt: '', // TODO: remove this line
    }
  },
  layerZero: {
    modules: {
      asset: '', // TODO: remove this line
    }
  }
};
