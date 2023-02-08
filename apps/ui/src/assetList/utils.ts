import Decimal from 'decimal.js';
import groupBy from 'just-group-by';
import { Asset } from 'src/types/asset';
import { getFirstLetterToUpperCase } from 'src/utils';
import type { ProtocolList } from 'umi-sdk';
import { protocolBook } from 'umi-sdk';

export const accumulateAssetsByCoin = (assetList: Asset[]): Asset[] => {

  const assetListByCoin = groupBy(
    assetList,
    (asset) => asset.coinProfile?.symbol
  );

  const assets: Asset[] = Object.entries(assetListByCoin)
    .map(([key, assets]) => {
      const accAmount = assets.reduce(
        (acc, asset) => asset.amount.gt(0)
          ? acc.add(asset.amount)
          : acc,
        new Decimal(0));

      const asset = new Asset({
        name: assets[0].coinProfile?.symbol ?? '',
        amount: accAmount,
        price: assets[0].price,
        logoURI: assets[0].coinProfile?.logoURI ?? '',
        info: {
          protocol: 'wallet'
        }
      });
      return asset;
    })
    .filter(asset => asset.mktValue.gt(0));

  return assets;
};

export const accumulateAssetsByProtocol = (assetList: Asset[]): Asset[] => {

  const assetListByProtocol = groupBy(
    assetList,
    (asset) => asset.info.protocol
  );

  const assets: Asset[] = Object.entries(assetListByProtocol)
    .map(([key, assets]) => {
      const accAmount = assets.reduce(
        (acc, asset) => asset.amount.gt(0)
          ? acc.add(asset.amount)
          : acc,
        new Decimal(0));

      const asset = new Asset({
        name: getFirstLetterToUpperCase(key),
        amount: accAmount,
        price: new Decimal(1),
        logoURI: protocolBook[key]?.logoURI ?? '',
        info: {
          protocol: key as ProtocolList,
        }
      });

      return asset;
    })
    .filter(asset => asset.mktValue.gt(0));

  return assets;
};

export const accumulateMktValue = (assetList: Asset[]): Decimal => {
  const accMktCap = assetList.reduce(
    (acc, asset) => asset.mktValue.gt(0)
      ? acc.add(asset.mktValue)
      : acc,
    new Decimal(0));

  return accMktCap;
};
