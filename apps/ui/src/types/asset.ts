import type Decimal from 'decimal.js';
import type { CoinProfile } from 'src/config/coinList';
import type { ProtocolList } from 'umi-sdk';

export class Asset {
  name: string;
  amount: Decimal;
  price: Decimal;
  logoURI: string;
  coinProfile?: CoinProfile;
  info: {
    protocol: ProtocolList | 'wallet'
    lpTokenType?: string
  };

  constructor(props: {
    name: string,
    amount: Decimal,
    price: Decimal,
    logoURI: string,
    coinProfile?: CoinProfile,
    info: {
      protocol: ProtocolList | 'wallet'
      lpTokenType?: string
    }
  }) {
    this.name = props.name;
    this.amount = props.amount;
    this.price = props.price;
    this.logoURI = props.logoURI;
    this.info = props.info;
    this.coinProfile = props.coinProfile;
  }

  get mktValue(): Decimal {
    return this.amount.mul(this.price);
  }
}

export class PairAssets {
  name: string[];
  amount: Decimal[];
  price: Decimal[];
  logoURI: string[];
  coinProfile?: CoinProfile[];
  info: {
    protocol: ProtocolList | 'wallet'
    lpTokenType?: string
  };

  constructor(props: {
    name: string[],
    amount: Decimal[],
    price: Decimal[],
    logoURI: string[],
    coinProfile?: CoinProfile[],
    info: {
      protocol: ProtocolList | 'wallet'
      lpTokenType?: string
    }
  }) {
    this.name = props.name;
    this.amount = props.amount;
    this.price = props.price;
    this.logoURI = props.logoURI;
    this.info = props.info;
    this.coinProfile = props.coinProfile;
  }

  get mktValue(): Decimal[] {
    return [this.amount[0].mul(this.price[0]), this.amount[1].mul(this.price[1])];
  }
}
