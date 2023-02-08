import type { Types } from 'aptos';
import { ok } from 'neverthrow';
import { protocolBook } from '../../protocolList';
import { PriceQuote, SwapSettings } from '../../types';
import { calcMinAmount } from '../calculator';
import { getDexType, getPoolType, getTypeArgs, is_x_to_y_ } from './helper';

const makeTypeArgs2hop = (quote: PriceQuote) => {
  const is_x_to_y_1 = is_x_to_y_(quote.swapRoute1);
  const is_x_to_y_2 = is_x_to_y_(quote.swapRoute2);

  const types1 = getTypeArgs(quote.swapRoute1.pool, is_x_to_y_1);
  if (types1.isErr()) return types1;
  const types2 = getTypeArgs(quote.swapRoute2.pool, is_x_to_y_2);
  if (types2.isErr()) return types2;

  const [X, Y, E1, _, Z, E2] = [...types1.value, ...types2.value];

  return ok([X, Y, Z, E1, E2]);
};

const makeTypeArgs3hop = (quote: PriceQuote) => {
  const is_x_to_y_1 = is_x_to_y_(quote.swapRoute1);
  const is_x_to_y_2 = is_x_to_y_(quote.swapRoute2);
  const is_x_to_y_3 = is_x_to_y_(quote.swapRoute3);

  const types1 = getTypeArgs(quote.swapRoute1.pool, is_x_to_y_1);
  if (types1.isErr()) return types1;
  const types2 = getTypeArgs(quote.swapRoute2.pool, is_x_to_y_2);
  if (types2.isErr()) return types2;
  const types3 = getTypeArgs(quote.swapRoute3.pool, is_x_to_y_3);
  if (types3.isErr()) return types3;

  const [X, Y, E1, _z, Z, E2, _w, W, E3] = [...types1.value, ...types2.value, ...types3.value];

  return ok([X, Y, Z, W, E1, E2, E3]);
};


const makeArgs2hop = (quote: PriceQuote, settings: SwapSettings)=>{
  const dexType1 = getDexType(quote.swapRoute1.pool);
  if (dexType1.isErr()) return dexType1;
  const dexType2 = getDexType(quote.swapRoute2.pool);
  if (dexType2.isErr()) return dexType2;

  const poolType1 = getPoolType(quote.swapRoute1.pool);
  const poolType2 = getPoolType(quote.swapRoute2.pool);

  const is_x_to_y_1 = is_x_to_y_(quote.swapRoute1);
  const is_x_to_y_2 = is_x_to_y_(quote.swapRoute2);

  const fromAmountStr = quote.fromCoin.toU64;
  const minToAmount = calcMinAmount(quote.toCoin, settings.slippageTolerance);
  const minToAmountStr = minToAmount.toU64;

  return ok([
    dexType1.value,
    poolType1,
    is_x_to_y_1,
    dexType2.value,
    poolType2,
    is_x_to_y_2,
    fromAmountStr,
    minToAmountStr,
  ]);
};


const makeArgs3hop = (quote: PriceQuote, settings: SwapSettings) => {
  const dexType1 = getDexType(quote.swapRoute1.pool);
  if (dexType1.isErr()) return dexType1;
  const dexType2 = getDexType(quote.swapRoute2.pool);
  if (dexType2.isErr()) return dexType2;
  const dexType3 = getDexType(quote.swapRoute3.pool);
  if (dexType3.isErr()) return dexType3;

  const poolType1 = getPoolType(quote.swapRoute1.pool);
  const poolType2 = getPoolType(quote.swapRoute2.pool);
  const poolType3 = getPoolType(quote.swapRoute3.pool);

  const is_x_to_y_1 = is_x_to_y_(quote.swapRoute1);
  const is_x_to_y_2 = is_x_to_y_(quote.swapRoute2);
  const is_x_to_y_3 = is_x_to_y_(quote.swapRoute3);

  const fromAmountStr = quote.fromCoin.toU64;
  const minToAmount = calcMinAmount(quote.toCoin, settings.slippageTolerance);
  const minToAmountStr = minToAmount.toU64;

  return ok([
    dexType1.value,
    poolType1,
    is_x_to_y_1,
    dexType2.value,
    poolType2,
    is_x_to_y_2,
    dexType3.value,
    poolType3,
    is_x_to_y_3,
    fromAmountStr,
    minToAmountStr,
  ]);
};

export const make2HopSwapPayload = (quote: PriceQuote, settings: SwapSettings) => {
  const typeArgs = makeTypeArgs2hop(quote);
  if (typeArgs.isErr()) return typeArgs;

  const args = makeArgs2hop(quote, settings);
  if (args.isErr()) return args;

  const payload: Types.TransactionPayload = {
    type: 'entry_function_payload',
    function: `${protocolBook.umi.modules().aggregator}::two_step_route`,
    // function: `${protocolBook.hippo.modules?.()?.aggregator}::two_step_route`,
    type_arguments: typeArgs.value,
    arguments: args.value,
  };

  return ok(payload);
};


export const make3HopSwapPayload = (quote: PriceQuote, settings: SwapSettings) => {
  const typeArgs = makeTypeArgs3hop(quote);
  if (typeArgs.isErr()) return typeArgs;

  const args = makeArgs3hop(quote, settings);
  if (args.isErr()) return args;

  const payload: Types.TransactionPayload = {
    type: 'entry_function_payload',
    function: `${protocolBook.umi.modules().aggregator}::three_step_route`,
    type_arguments: typeArgs.value,
    arguments: args.value,
  };

  return ok(payload);
};
