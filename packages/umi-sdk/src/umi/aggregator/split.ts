import type { Types } from 'aptos';
import { ok } from 'neverthrow';
import { protocolBook } from '../../protocolList';
import { PriceQuote, SwapSettings } from '../../types';
import { calcMinAmount } from '../calculator';
import { getDexType, getPoolType, getTypeArgs, is_x_to_y_ } from './helper';

const get2SplitTypeArgsFromQuote = (quote: PriceQuote) => {
  const is_x_to_y_1 = is_x_to_y_(quote.swapRoute1);
  const is_x_to_y_2 = is_x_to_y_(quote.swapRoute2);

  const types1 = getTypeArgs(quote.swapRoute1.pool, is_x_to_y_1);
  if (types1.isErr()) return types1;
  const types2 = getTypeArgs(quote.swapRoute2.pool, is_x_to_y_2);
  if (types2.isErr()) return types2;

  const [X, Y, E1] = types1.value;
  const [_, __, E2] = types2.value;

  return ok([X, Y, E1, E2]);
};

const get3SplitTypeArgsFromQuote = (quote: PriceQuote) => {
  const is_x_to_y_1 = is_x_to_y_(quote.swapRoute1);
  const is_x_to_y_2 = is_x_to_y_(quote.swapRoute2);
  const is_x_to_y_3 = is_x_to_y_(quote.swapRoute3);

  const types1 = getTypeArgs(quote.swapRoute1.pool, is_x_to_y_1);
  if (types1.isErr()) return types1;
  const types2 = getTypeArgs(quote.swapRoute2.pool, is_x_to_y_2);
  if (types2.isErr()) return types2;
  const types3 = getTypeArgs(quote.swapRoute3.pool, is_x_to_y_3);
  if (types3.isErr()) return types3;

  const [X, Y, E1] = types1.value;
  const [_2, __2, E2] = types2.value;
  const [_3, __3, E3] = types3.value;

  return ok([X, Y, E1, E2, E3]);
};

const get2SplitArgsFromQuote = (quote: PriceQuote, settings: SwapSettings) => {
  const dexType1 = getDexType(quote.swapRoute1.pool);
  if (dexType1.isErr()) return dexType1;
  const dexType2 = getDexType(quote.swapRoute2.pool);
  if (dexType2.isErr()) return dexType2;

  const poolType1 = getPoolType(quote.swapRoute1.pool);
  const poolType2 = getPoolType(quote.swapRoute2.pool);

  const is_x_to_y_1 = is_x_to_y_(quote.swapRoute1);
  const is_x_to_y_2 = is_x_to_y_(quote.swapRoute2);

  const firstPart = (quote.swapRoute1.part.toNumber() * 1e3).toString(); // permille

  const fromAmountStr = quote.fromCoin.toU64;
  const minToAmount = calcMinAmount(quote.toCoin, settings.slippageTolerance);
  const minToAmountStr = minToAmount.toU64;

  return ok([
    dexType1.value,
    poolType1,
    is_x_to_y_1,
    firstPart,
    dexType2.value,
    poolType2,
    is_x_to_y_2,
    fromAmountStr,
    minToAmountStr,
  ]);
};

const get3SplitArgsFromQuote = (quote: PriceQuote, settings: SwapSettings) => {
  const dexType1 = getDexType(quote.swapRoute1.pool);
  if (dexType1.isErr()) return dexType1;
  const dexType2 = getDexType(quote.swapRoute2.pool);
  if (dexType2.isErr()) return dexType2;
  const dexType3 = getDexType(quote.swapRoute3.pool);
  if (dexType3.isErr()) return dexType2;

  const poolType1 = getPoolType(quote.swapRoute1.pool);
  const poolType2 = getPoolType(quote.swapRoute2.pool);
  const poolType3 = getPoolType(quote.swapRoute3.pool);

  const is_x_to_y_1 = is_x_to_y_(quote.swapRoute1);
  const is_x_to_y_2 = is_x_to_y_(quote.swapRoute2);
  const is_x_to_y_3 = is_x_to_y_(quote.swapRoute3);

  const firstPart = (quote.swapRoute1.part.toNumber() * 1e3).toString(); // permille
  const secondPart = (quote.swapRoute2.part.toNumber() * 1e3).toString(); // permille

  const fromAmountStr = quote.fromCoin.toU64;
  const minToAmount = calcMinAmount(quote.toCoin, settings.slippageTolerance);
  const minToAmountStr = minToAmount.toU64;

  return ok([
    dexType1.value,
    poolType1,
    is_x_to_y_1,
    firstPart,
    dexType2.value,
    poolType2,
    is_x_to_y_2,
    secondPart,
    dexType3.value,
    poolType3,
    is_x_to_y_3,
    fromAmountStr,
    minToAmountStr,
  ]);
};

export const make2SplitSwapPayload = (quote: PriceQuote, settings: SwapSettings) => {
  const typeArgs = get2SplitTypeArgsFromQuote(quote);
  if (typeArgs.isErr()) return typeArgs;

  const args = get2SplitArgsFromQuote(quote, settings);
  if (args.isErr()) return args;

  const payload: Types.TransactionPayload = {
    type: 'entry_function_payload',
    function: `${protocolBook.umi.modules().aggregator}::two_split_route`,
    // function: `${protocolBook.hippo.modules().aggregator}::two_split_route`,
    type_arguments: typeArgs.value,
    arguments: args.value,
  };

  return ok(payload);
};

export const make3SplitSwapPayload = (quote: PriceQuote, settings: SwapSettings) => {
  const typeArgs = get3SplitTypeArgsFromQuote(quote);
  if (typeArgs.isErr()) return typeArgs;

  const args = get3SplitArgsFromQuote(quote, settings);
  if (args.isErr()) return args;

  const payload: Types.TransactionPayload = {
    type: 'entry_function_payload',
    function: `${protocolBook.umi.modules().aggregator}::three_split_route`,
    type_arguments: typeArgs.value,
    arguments: args.value,
  };

  return ok(payload);
};
