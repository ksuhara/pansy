import type { Types } from 'aptos';
import { CoinAmount } from '../CoinAmount';
import { protocolBook } from '../protocolList';

const proto = protocolBook.umi;

export const umiSwapX2YTransactionPayload = (
  coinFrom: CoinAmount,
  coinTo: CoinAmount,
) => {
  const slippage = 0.9;
  // const amountIn = coinFrom.amount.mul(10 ** coinFrom.decimals).round().toString()
  const amountIn = '100';
  const minAmountOut = coinTo.amount.mul(slippage)
    .mul(10 ** coinTo.coinInfo.decimals).round().toString();
  const payload: Types.TransactionPayload =
  {
    'function': `${proto.account}::pool::swap_x_to_y_dec`,
    'type_arguments': [
      coinFrom.coinInfo.type,
      coinTo.coinInfo.type,
    ],
    'arguments': [
      amountIn,
      minAmountOut,
      coinFrom.coinInfo.decimals,
      coinTo.coinInfo.decimals,
    ],
    'type': 'entry_function_payload'
  };
  return payload;
};

