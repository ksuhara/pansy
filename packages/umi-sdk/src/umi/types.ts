interface DecimalABI {
  'dec': number
  'neg': boolean
  'value': string
}

export type UmiPot = {
  'reserve': {
    'value': string
  },
  'price': DecimalABI,
  'weight': DecimalABI,
  'min_weight': DecimalABI,
  'fee': DecimalABI,
  'rebate': DecimalABI,
};

export type UmiLiquidityPool = {
  'coin_x': {
    'value': string
  },
  'coin_y': {
    'value': string
  },
  'config': {
    'fee_rate': {
      'dec': number,
      'neg': boolean,
      'value': string
    },
    'greedy_alpha': {
      'dec': number,
      'neg': boolean,
      'value': string
    },
    'slack_mu': {
      'dec': number,
      'neg': boolean,
      'value': string
    }
  }
};
