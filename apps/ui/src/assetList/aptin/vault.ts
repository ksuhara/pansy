import type { MaybeHexString } from 'aptos';
import { fetchAccountResource } from 'src/config/chain/client';
import { protocolBook } from 'umi-sdk';
import type { AptinBorrowPoolData, AptinSupplyPoolData } from './type';

const aptinAccount = '0xf91fbeba7d9cf56e539a590eea52a91f43fef718e151c417dae084fe546ff21';

export const fetchAptinSupplyPool = async (coinType: string) => {
  const resourceType = `${protocolBook.aptin.accounts().vault}::pool::SupplyPool<${coinType}>`;
  const r = await fetchAccountResource<AptinSupplyPoolData>(aptinAccount, resourceType);

  return r;
};

export const fetchAptinBorrowPool = async (coinType: string) => {
  const resourceType = `${protocolBook.aptin.accounts().vault}::pool::BorrowPool<${coinType}>`;
  const r = await fetchAccountResource<AptinBorrowPoolData>(aptinAccount, resourceType);

  return r;
};

export const fetchAptinPositionByAddress = async (address: MaybeHexString, coinType: string) => {

  const supply_pool = await fetchAptinSupplyPool(coinType);
  const borrow_pool = await fetchAptinBorrowPool(coinType);

  if (supply_pool.isErr()) return {};
  if (borrow_pool.isErr()) return {};

  const lending = supply_pool.value.position.find(d => d.user === address);
  const borrowing = borrow_pool.value.position.find(d => d.user === address);

  return { lending, borrowing };
};
