import type { GetObjectDataResponse, UnserializedSignableTransaction } from '@mysten/sui.js';
import { getObjectId } from '@mysten/sui.js';
import { err, ok } from 'neverthrow';
import { packageBook } from 'src/config/addressList';
import type { PriceQuote, SwapSettings } from 'umi-sdk';
import { CoinAmount, is_x_to_y_ } from 'umi-sdk';

export const make1hopSwapPayload = (
  quote: PriceQuote,
  swapSettings: SwapSettings,
  coins_s: GetObjectDataResponse[],
) => {
  const CoinS = quote.fromCoin.coinInfo;
  const CoinT = quote.toCoin.coinInfo;
  const first_pool = quote.swapRoute1.pool.objectId;

  const sourceCoinAmount = quote.fromCoin;
  const minTargetCoinAmount = new CoinAmount(
    quote.toCoin.coinInfo,
    quote.toCoin.amount.mul(swapSettings.slippageTolerance)
  );

  const is_x_to_y = is_x_to_y_(quote.swapRoute1);

  const first_direction = is_x_to_y ? '0' : '1';
  const first_package = quote.swapRoute1.pool.protocolName;

  const payload: UnserializedSignableTransaction = {
    kind: 'moveCall',
    data: {
      packageObjectId: packageBook.sui_aggregator.packageObjectId,
      module: packageBook.sui_aggregator.modules.aggregator,
      function: `one_hop_${first_direction}_${first_package}_script`,
      typeArguments: [CoinS.type, CoinT.type],
      arguments: [
        first_pool,
        coins_s.map(coin => getObjectId(coin)),
        sourceCoinAmount.toU64,
        minTargetCoinAmount.toU64,
      ],
      gasBudget: 10000,
    },
  };

  return ok(payload);
};

export const make2hopSwapPayload = (
  quote: PriceQuote,
  swapSettings: SwapSettings,
  coins_s: GetObjectDataResponse[],
) => {
  if (coins_s.length < 1) return err('The length input coins is less than 1');

  const CoinS = quote.fromCoin.coinInfo;
  const CoinT = quote.toCoin.coinInfo;
  const first_pool = quote.swapRoute1.pool.objectId;
  const second_pool = quote.swapRoute2.pool.objectId;

  const first_is_x_to_y = is_x_to_y_(quote.swapRoute1);
  const second_is_x_to_y = is_x_to_y_(quote.swapRoute2);
  const first_direction = first_is_x_to_y ? '0' : '1';
  const second_direction = second_is_x_to_y ? '0' : '1';
  const first_package = quote.swapRoute1.pool.protocolName;
  const second_package = quote.swapRoute2.pool.protocolName;

  const sourceCoinAmount = quote.fromCoin;
  const minTargetCoinAmount = new CoinAmount(
    quote.toCoin.coinInfo,
    quote.toCoin.amount.mul(swapSettings.slippageTolerance)
  );

  const CoinU = first_is_x_to_y
    ? quote.swapRoute1.pool.pair.coinY.coinInfo
    : quote.swapRoute1.pool.pair.coinX.coinInfo;

  const payload: UnserializedSignableTransaction = {
    kind: 'moveCall',
    data: {
      packageObjectId: packageBook.sui_aggregator.packageObjectId,
      module: packageBook.sui_aggregator.modules.aggregator,
      function: `two_hop_${first_direction}${second_direction}_${first_package}_${second_package}_script`,
      typeArguments: [CoinS.type, CoinT.type, CoinU.type],
      arguments: [
        first_pool,
        second_pool,
        coins_s.map(coin => getObjectId(coin)),
        sourceCoinAmount.toU64,
        minTargetCoinAmount.toU64,
      ],
      gasBudget: 10000,
    },
  };

  return ok(payload);
};

export const make3hopSwapPayload = (
  quote: PriceQuote,
  swapSettings: SwapSettings,
  coins_s: GetObjectDataResponse[],
) => {
  if (coins_s.length < 1) return err('The length input coins is less than 1');

  const CoinS = quote.fromCoin.coinInfo;
  const CoinT = quote.toCoin.coinInfo;
  const first_pool = quote.swapRoute1.pool.objectId;
  const second_pool = quote.swapRoute2.pool.objectId;
  const third_pool = quote.swapRoute3.pool.objectId;

  const first_is_x_to_y = is_x_to_y_(quote.swapRoute1);
  const second_is_x_to_y = is_x_to_y_(quote.swapRoute2);
  const third_is_x_to_y = is_x_to_y_(quote.swapRoute3);
  const first_direction = first_is_x_to_y ? '0' : '1';
  const second_direction = second_is_x_to_y ? '0' : '1';
  const third_direction = third_is_x_to_y ? '0' : '1';
  const first_package = quote.swapRoute1.pool.protocolName;
  const second_package = quote.swapRoute2.pool.protocolName;
  const third_package = quote.swapRoute3.pool.protocolName;

  const sourceCoinAmount = quote.fromCoin;
  const minTargetCoinAmount = new CoinAmount(
    quote.toCoin.coinInfo,
    quote.toCoin.amount.mul(swapSettings.slippageTolerance)
  );

  const CoinU = first_is_x_to_y
    ? quote.swapRoute1.pool.pair.coinY.coinInfo
    : quote.swapRoute1.pool.pair.coinX.coinInfo;

  const CoinV = second_is_x_to_y
    ? quote.swapRoute2.pool.pair.coinY.coinInfo
    : quote.swapRoute2.pool.pair.coinX.coinInfo;

  const payload: UnserializedSignableTransaction = {
    kind: 'moveCall',
    data: {
      packageObjectId: packageBook.sui_aggregator.packageObjectId,
      module: packageBook.sui_aggregator.modules.aggregator,
      function: `three_hop_${first_direction}${second_direction}${third_direction}_${first_package}_${second_package}_${third_package}_script`,
      typeArguments: [CoinS.type, CoinT.type, CoinU.type, CoinV.type],
      arguments: [
        first_pool,
        second_pool,
        third_pool,
        coins_s.map(coin => getObjectId(coin)),
        sourceCoinAmount.toU64,
        minTargetCoinAmount.toU64,
      ],
      gasBudget: 10000,
    },
  };

  return ok(payload);
};

export const make2splitSwapPayload = (
  quote: PriceQuote,
  swapSettings: SwapSettings,
  coins_s: GetObjectDataResponse[],
) => {
  if (coins_s.length < 1) return err('The length input coins is less than 1');

  const CoinS = quote.fromCoin.coinInfo;
  const CoinT = quote.toCoin.coinInfo;
  const first_pool = quote.swapRoute1.pool.objectId;
  const second_pool = quote.swapRoute2.pool.objectId;

  const first_is_x_to_y = is_x_to_y_(quote.swapRoute1);
  const second_is_x_to_y = is_x_to_y_(quote.swapRoute2);
  const first_direction = first_is_x_to_y ? '0' : '1';
  const second_direction = second_is_x_to_y ? '0' : '1';
  const first_package = quote.swapRoute1.pool.protocolName;
  const second_package = quote.swapRoute2.pool.protocolName;

  const sourceCoinAmount = quote.fromCoin;
  const minTargetCoinAmount = new CoinAmount(
    quote.toCoin.coinInfo,
    quote.toCoin.amount.mul(swapSettings.slippageTolerance)
  );

  const payload: UnserializedSignableTransaction = {
    kind: 'moveCall',
    data: {
      packageObjectId: packageBook.sui_aggregator.packageObjectId,
      module: packageBook.sui_aggregator.modules.aggregator,
      function: `two_split_${first_direction}${second_direction}_${first_package}_${second_package}_script`,
      typeArguments: [CoinS.type, CoinT.type],
      arguments: [
        first_pool,
        second_pool,
        coins_s.map(coin => getObjectId(coin)),
        quote.swapRoute1.part.mul(10 ** 3).round().toString(),
        sourceCoinAmount.toU64,
        minTargetCoinAmount.toU64,
      ],
      gasBudget: 10000,
    },
  };

  return ok(payload);
};

export const make3splitSwapPayload = (
  quote: PriceQuote,
  swapSettings: SwapSettings,
  coins_s: GetObjectDataResponse[],
) => {
  if (coins_s.length < 1) return err('The length input coins is less than 1');

  const CoinS = quote.fromCoin.coinInfo;
  const CoinT = quote.toCoin.coinInfo;
  const first_pool = quote.swapRoute1.pool.objectId;
  const second_pool = quote.swapRoute2.pool.objectId;
  const third_pool = quote.swapRoute3.pool.objectId;

  const first_is_x_to_y = is_x_to_y_(quote.swapRoute1);
  const second_is_x_to_y = is_x_to_y_(quote.swapRoute2);
  const third_is_x_to_y = is_x_to_y_(quote.swapRoute3);
  const first_direction = first_is_x_to_y ? '0' : '1';
  const second_direction = second_is_x_to_y ? '0' : '1';
  const third_direction = third_is_x_to_y ? '0' : '1';
  const first_package = quote.swapRoute1.pool.protocolName;
  const second_package = quote.swapRoute2.pool.protocolName;
  const third_package = quote.swapRoute3.pool.protocolName;

  const sourceCoinAmount = quote.fromCoin;
  const minTargetCoinAmount = new CoinAmount(
    quote.toCoin.coinInfo,
    quote.toCoin.amount.mul(swapSettings.slippageTolerance)
  );

  const payload: UnserializedSignableTransaction = {
    kind: 'moveCall',
    data: {
      packageObjectId: packageBook.sui_aggregator.packageObjectId,
      module: packageBook.sui_aggregator.modules.aggregator,
      function: `three_split_${first_direction}${second_direction}${third_direction}_${first_package}_${second_package}_${third_package}_script`,
      typeArguments: [CoinS.type, CoinT.type],
      arguments: [
        first_pool,
        second_pool,
        third_pool,
        coins_s.map(coin => getObjectId(coin)),
        quote.swapRoute1.part.mul(10 ** 3).round().toString(),
        quote.swapRoute2.part.mul(10 ** 3).round().toString(),
        sourceCoinAmount.toU64,
        minTargetCoinAmount.toU64,
      ],
      gasBudget: 10000,
    },
  };

  return ok(payload);
};

export const makeSuiSwapPayload = (
  quote: PriceQuote,
  swapSettings: SwapSettings,
  coins_s: GetObjectDataResponse[],
) => {
  if (quote.swapType === 'split') {
    if (quote.swapRoute3) {
      return make3splitSwapPayload(quote, swapSettings, coins_s);
    } else {
      return make2splitSwapPayload(quote, swapSettings, coins_s);
    }
  } else {
    if (quote.swapRoute3) {
      return make3hopSwapPayload(quote, swapSettings, coins_s);
    } else if (quote.swapRoute2) {
      return make2hopSwapPayload(quote, swapSettings, coins_s);
    } else {
      return make1hopSwapPayload(quote, swapSettings, coins_s);
    }
  }
};
