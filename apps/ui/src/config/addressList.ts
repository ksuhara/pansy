
export const packageBook = {
  sui_aggregator: {
    packageObjectId: '0x897d0f1560fade9de65ee57b548294dd4ffb9ca5',
    modules: {
      aggregator: 'aggregator'
    }
  },
  udoswap: {
    packageObjectId: '0xc361d8410261dc5b3a23a779837afc27bab7a22e',
    dex: {
      name: 'dex',
      create_pool: 'create_pool',
      add_liquidity: 'add_liquidity',
    }
  },
  umaswap: {
    packageObjectId: '0x459a6767bc6c765d2deae5a23ec0d9ec0a66a946',
    dex: {
      name: 'dex',
      create_pool: 'create_pool',
      add_liquidity: 'add_liquidity',
    }
  },
  // suiswap: {
  //   packageObjectId: '0xa49083dd15863269c84624e83201ede24fc397aa',
  //   pool: {
  //     name: 'pool',
  //     SwapCap: '0xc5e8d9e13e858eed03e16e7f6afe826d393d1c94',
  //   }
  // },
};

export const poolObjectIdBook = {
  udoswap: {
    BTC_USDC: '0x93e424105a13a97644f8db8bff7bc42cb00e0752',
    USDT_USDC: '0xdc25ea8396de64256dfe40a4818c0fa06ca809f8',
    ETH_USDC: '0x91650ffd35936efe8341c2a6c46b4ade457aa413',
  },
  umaswap: {
    BTC_USDC: '0x73e2cecc61cf5db5410e80c658783189154a9004',
  },
};
