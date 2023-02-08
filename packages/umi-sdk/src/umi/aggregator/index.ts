export * from './helper';

import { err } from 'neverthrow';
import { PriceQuote, SwapSettings } from '../../types';
import { makeDirectSwapPayload } from './direct';
import { make2HopSwapPayload, make3HopSwapPayload } from './multi-hop';
import { make2SplitSwapPayload, make3SplitSwapPayload } from './split';

export const makeSwapPayload = (quote: PriceQuote, settings: SwapSettings) => {
  if (quote.swapType === 'direct') {
    return makeDirectSwapPayload(quote, settings);
  } else if (quote.swapType === 'split') {
    if (quote.swapRoute3) {
      return make3SplitSwapPayload(quote, settings);
    } else {
      return make2SplitSwapPayload(quote, settings);
    }
  } else if (quote.swapType === 'multi-hop') {
    if (quote.swapRoute3) {
      return make3HopSwapPayload(quote, settings);
    } else if (quote.swapRoute2) {
      return make2HopSwapPayload(quote, settings);
    }
  }

  return err(`Invalid arguments: ${quote.swapType}`);
};
