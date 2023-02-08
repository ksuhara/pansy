import type { MaybeHexString } from 'aptos';


export const protocolBookMainnet: Record<string, {
  accounts?: Record<string, MaybeHexString>,
  modules?: Record<string, string>,
  structs?: Record<string, string>,
}> = {
  umi: {
    accounts: {
      aggregator: '0xbeaa9e5ef5bee0781476a4adf293aae7dc3a28e9bd79fda89fca7211fb94c80',
    },
    modules: {
      aggregator: '0xbeaa9e5ef5bee0781476a4adf293aae7dc3a28e9bd79fda89fca7211fb94c80::aggregator',
    },
  },
  anime: {
    accounts: {
      pool: '0x796900ebe1a1a54ff9e932f19c548f5c1af5c6e7d34965857ac2f7b1d1ab2cbf',
    },
    modules: {
      pool: '0x16fe2df00ea7dde4a63409201f7f4e536bde7bb7335526a35d05111e68aa322c::AnimeSwapPoolV1',
      coins: '', // TODO: remove this line
    },
    structs: {
      LiquidityPool: '0x16fe2df00ea7dde4a63409201f7f4e536bde7bb7335526a35d05111e68aa322c::AnimeSwapPoolV1::LiquidityPool',
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
  argo: {
    accounts: {
      type: '0x98298d34bcf896c663e069c464754e0cfd36b50e21eedd8db0e4189168057cb7',
      vault: '0xa0a017f8d8a695731dcdb8bf27e2da141da68785b347aaa5b87c5e0fa4332222',
    },
    modules: {
      usda: '0x1000000fa32d122c18a6a31c009ce5e71674f22d06a581bb0a15575e6addadcc::usda',
      engine: '0x98298d34bcf896c663e069c464754e0cfd36b50e21eedd8db0e4189168057cb7::engine_v1',
      namespace: '0xa0a017f8d8a695731dcdb8bf27e2da141da68785b347aaa5b87c5e0fa4332222::namespace',
      console: '0x98298d34bcf896c663e069c464754e0cfd36b50e21eedd8db0e4189168057cb7::console_v1',
    },
    structs: {
      Vault: '0x98298d34bcf896c663e069c464754e0cfd36b50e21eedd8db0e4189168057cb7::engine_v1::Vault',
    }
  },
  pancake: {
    accounts: {
      pool: '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa',
    },
    modules: {
      swap: '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap',
    },
    structs: {
      TokenPairReserve: '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::TokenPairReserve',
    },
  },
  aux: {
    accounts: {
      pool: '0xbd35135844473187163ca197ca93b2ab014370587bb0ed3befff9e902d6bb541'
    },
    modules: {
      amm: '0xbd35135844473187163ca197ca93b2ab014370587bb0ed3befff9e902d6bb541::amm',
    },
    structs: {
      Pool: '0xbd35135844473187163ca197ca93b2ab014370587bb0ed3befff9e902d6bb541::amm::Pool',
    },
  },
  obric: {
    accounts: {
      pool: '0xc7ea756470f72ae761b7986e4ed6fd409aad183b1b2d3d2f674d979852f45c4b',
    },
    modules: {
      piece_swap: '0xc7ea756470f72ae761b7986e4ed6fd409aad183b1b2d3d2f674d979852f45c4b::piece_swap',
    },
    structs: {
      PieceSwapPoolInfo: '0xc7ea756470f72ae761b7986e4ed6fd409aad183b1b2d3d2f674d979852f45c4b::piece_swap::PieceSwapPoolInfo',
    },
  },
  hippo: {
    accounts: {
      pool: '',
    },
    modules: {
      aggregator: '0x89576037b3cc0b89645ea393a47787bb348272c76d6941c574b053672b848039::aggregator',
      cp_swap: '',
      coins: '', // TODO: Remove this line
      devnet: '', // TODO: Remove this line
    },
  },
  pontem: {
    accounts: {
      // pool: '0x05a97986a9d031c4567e15b797be516910cfcb4156312482efc6a19c0a30c948',
      pool: '0x5a97986a9d031c4567e15b797be516910cfcb4156312482efc6a19c0a30c948',
    },
    modules: {
      pool: '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::liquidity_pool',
      lp: '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::lp_coin',
      curves: '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves',
      coins: '', // TODO: remove this line
    },
    structs: {
      LiquidityPool: '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::liquidity_pool::LiquidityPool',
      Uncorrelated: '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Uncorrelated',
      Stable: '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Stable',
    },
  },
  cetus: {
    accounts: {
      pool: '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba',
    },
    modules: {
      amm_swap: '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap',
    },
    structs: {
      Pool: '0xec42a352cc65eca17a9fa85d0fc602295897ed6b8b8af6a6c79ef490eb8f9eba::amm_swap::Pool',
    },
  },
  tortuga: {
    accounts: {
      pool: '0x84d7aeef42d38a5ffc3ccef853e1b82e4958659d16a7de736a29c55fbbeb0114',
    },
    modules: {
      router: '0x8f396e4246b2ba87b51c0739ef5ea4f26515a98375308c31ac2ec1e42142a57f::stake_router',
      coins: '0x84d7aeef42d38a5ffc3ccef853e1b82e4958659d16a7de736a29c55fbbeb0114::staked_aptos_coin'
    }
  },
  ditto: {
    accounts: {
      pool: '0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5',
    },
    modules: {
      coins: '0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::staked_coin',
    },
    structs: {
      Vault: '0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::staked_coin::StakedAptos',
    }
  },
  wormhole: {
    modules: {
      usdc: '0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin',
      usdt: '0xa2eda21a58856fda86451436513b867c97eecb4ba099da5775520e0f7492e852::coin',
    }
  },
  layerZero: {
    modules: {
      asset: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset',
    }
  }
};
