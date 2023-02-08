import type { MaybeHexString, TxnBuilderTypes } from 'aptos';
import { HexString } from 'aptos';

export const getOmitAddress = (address: MaybeHexString | null | undefined, count = 4): string | null => {
  if (!address || (address as string).length === 0) return null;
  const addr = (address ?? '') as string;
  return `${addr.slice(0, count) ?? ''}...${addr.slice(-count) ?? ''}`;
};

export const base58Letters = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

export const TypeTagStructToString = (struct: TxnBuilderTypes.TypeTagStruct) => {
  // Keep address.address
  const address = HexString.fromUint8Array(struct.value.address.address).toShortString();
  const modname = struct.value.module_name.value;
  const structname = struct.value.name.value;
  return `${address}::${modname}::${structname}`;
};
