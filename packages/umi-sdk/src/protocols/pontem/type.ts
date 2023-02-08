import { PoolInfoFull, PoolStatus } from '../../types'

export interface PontemLiqudityPool {
  'coin_x_reserve': {
    'value': string
  },
  'coin_y_reserve': {
    'value': string
  },
  'last_block_timestamp': string,
  'last_price_x_cumulative': string
  'last_price_y_cumulative': string
  'lp_burn_cap': {
    'dummy_field': false
  },
  'lp_mint_cap': {
    'dummy_field': false
  },
  'x_scale': string
  'y_scale': string
  locked: boolean
  fee: string
  dao_fee: string
}

export type LiquidswapPoolInfo = PoolInfoFull & {
  protocolName: 'pontem',
  extensions: {
    curveType: string;
    fee: number;
  }
};

export type PontemPoolStatus = PoolStatus & {
  protocolName: 'pontem',
  extensions: {
    curveType: string;
    fee: number;
  }
}

