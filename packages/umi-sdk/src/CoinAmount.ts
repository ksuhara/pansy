import type { U64 } from "aptos/src/generated";
import Decimal from "decimal.js";
import numeral from "numeral";
import { CoinProfile } from "../../../apps/ui/src/config/coinList";

export class CoinAmount {
  coinInfo: CoinProfile;
  amount: Decimal;

  constructor(coinInfo: CoinProfile, amount: U64 | number | Decimal) {
    this.coinInfo = coinInfo;
    if (typeof amount === "number" || typeof amount === "string") {
      this.amount = new Decimal(amount).div(10 ** coinInfo.decimals);
    } else {
      this.amount = amount;
    }
  }

  get truncatedAmount(): Decimal {
    return new Decimal(this.amount.toPrecision(this.coinInfo.decimals));
  }

  get toU64(): U64 {
    return this.amount
      .mul(10 ** this.coinInfo.decimals)
      .round()
      .toString();
  }

  public toFixed(decimals?: number) {
    if (this.amount.eq(0)) return "0";

    const fixed = numeral(this.amount.toNumber()).format(
      `0,0.${"0".repeat(decimals || this.coinInfo.decimals)}`
    );

    return fixed;
  }
}
