import { getCoinProfileBySymbol } from "../../../../apps/ui/src/config/coinList";
import { protocolBook } from "../protocolList";

const protocolName = protocolBook.umi.name;
const potList = [
  {
    coinType: getCoinProfileBySymbol("BTC"),
  },
  {
    coinType: getCoinProfileBySymbol("BTC"),
  },
];
