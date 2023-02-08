import { AptosClient, MaybeHexString } from "aptos";
import type { U64 } from "aptos/src/generated";
import Decimal from "decimal.js";
import { ResultAsync } from "neverthrow";
import numeral from "numeral";
import { selectedEndpoint } from "../../../../apps/ui/src/config/chain";
import { CoinProfile } from "../../../../apps/ui/src/config/coinList";
import { ErrorMessage } from "../types";

class CoinAmount {
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

export const aptosClient = () => {
  return new AptosClient(selectedEndpoint()!);
};

export const fetchAccountResource = <T>(
  addr: MaybeHexString,
  resourceType: string
) =>
  ResultAsync.fromPromise(
    aptosClient()
      .getAccountResource(addr, resourceType)
      .then((r) => r.data as T),
    (e: any) => e.body as ErrorMessage
  );

export const fetchAccountResources = (accountAddress: MaybeHexString) => {
  const fetcher = aptosClient().getAccountResources(accountAddress);
  const errorHandler = (e: any) => e.body as ErrorMessage;

  return ResultAsync.fromPromise(fetcher, errorHandler);
};

export const fetchAptosCoinStore = async (
  accountAddress: string,
  coin: CoinProfile
) => {
  const resourceType = `0x1::coin::CoinStore<${coin.type}>`;
  return fetchAccountResource(accountAddress, resourceType);
};
