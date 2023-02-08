import { simulatePayloadTx, SimulationKeys } from '@manahippo/move-to-ts';
import { AptosAccount, AptosClient, HexString, Types } from 'aptos';
import Decimal from 'decimal.js';
import { MultiUndirectedGraph } from 'graphology';
import range from 'just-range';
import { ResultAsync } from 'neverthrow';
import { CoinAmount, createPoolGraph, fetchAnimeSwapPools, fetchAptoswapnetPools, fetchAuxPools, fetchCetusPools, fetchPancakePools, fetchPontemPools, getCoinProfileBySymbol, getQuotes, makeSwapPayload, PoolStatus, PriceQuote } from '../src';


let NODE_URL = 'https://aptos-mainnet.nodereal.io/v1/3e18914c169e4dfaa5824895a8d1def9'

const APT = getCoinProfileBySymbol('APT')!
const aptosClient = () => new AptosClient(NODE_URL);

const getPoolGraph = async () => {
  const fetchPools = () => Promise
    .all([
      fetchAnimeSwapPools(),
      fetchAptoswapnetPools(),
      fetchAuxPools(),
      fetchCetusPools(),
      fetchPontemPools(),
      fetchPancakePools(),
    ])
    .then(p => p.flat())
    // ignore null
    .then(p => p.filter(pp => !!pp));

  const poolList: PoolStatus[] = await fetchPools()

  const poolGraph = createPoolGraph(poolList)

  return poolGraph
}


const calcAptDiff = async (
  simkeys: SimulationKeys,
  payload: Types.TransactionPayload,
  sourceCoinAmount: CoinAmount,
  targetCoinAmount: CoinAmount,
) => {
  const simTxResult = await simulatePayloadTx(aptosClient(), simkeys, payload);
  const aptGas = new CoinAmount(APT, new Decimal(simTxResult.gas_used).mul(100).div(1e8))

  let aptDiff = new CoinAmount(targetCoinAmount.coinInfo,
    targetCoinAmount.amount
      .sub(sourceCoinAmount.amount)
      .sub(aptGas.amount)
  )

  // console.log(
  //   sourceCoinAmount.coinInfo.symbol, sourceCoinAmount.amount.toPrecision(6),
  //   '>',
  //   targetCoinAmount.coinInfo.symbol, targetCoinAmount.amount.toPrecision(6),
  //   '-',
  //   'gas', aptGas.amount.toPrecision(6),
  //   '...',
  //   aptDiff.amount.toNumber()
  // )

  return { aptDiff, aptGas }
}


const arbitrageCoinAmount = async (
  poolGraph: MultiUndirectedGraph,
  maxInputCoinAmountList: CoinAmount[],
  simkeys: SimulationKeys,
): {
  quote: PriceQuote
  payload: Types.TransactionPayload
  aptDiff: CoinAmount
  aptGas: CoinAmount
} => {
  let targetCoin = maxInputCoinAmountList[0].coinInfo
  let maxSofarAptDiff = new CoinAmount(targetCoin, -1e10)

  let bestQuotePayload: {
    quote: PriceQuote
    payload: Types.TransactionPayload,
    aptDiff: CoinAmount
    aptGas: CoinAmount
  };

  await Promise.all(
    maxInputCoinAmountList
      .map(async sourceCoinAmount => {
        const quoteList = await getQuotes(poolGraph, sourceCoinAmount, targetCoin)

        await Promise.all(
          quoteList.slice(0, 1).map(async quote => {
            const payload_opt = makeSwapPayload(quote, swapSettings);
            const targetCoinAmount = quote.toCoin

            if (payload_opt.isOk()) {
              let payload = payload_opt.value
              let { aptDiff, aptGas } = await calcAptDiff(simkeys, payload, sourceCoinAmount, targetCoinAmount)

              if (aptDiff.amount.gt(maxSofarAptDiff.amount)) {
                maxSofarAptDiff = aptDiff
                bestQuotePayload = { quote, payload, aptDiff, aptGas }
              }
            }
          })
        )
      })
  )

  return bestQuotePayload
}

const swapSettings = {
  maxGasFee: 40_000,
  slippageTolerance: 0.02,
  transactionDeadline: 3,
};

const signAndSubmitTransaction = async (
  client: AptosClient,
  account: AptosAccount,
  payload: Types.TransactionPayload
) => {
  const txnRequest = await client.generateTransaction(account.address(), payload);
  const signedTxn = await client.signTransaction(account, txnRequest);
  const transactionRes = await client.submitTransaction(signedTxn);
  await client.waitForTransaction(transactionRes.hash);
  return transactionRes.hash;
};

const maxSourceCoinAmountRecord: Record<string, CoinAmount[]> = Object.entries({
  'APT': range(0.05, 1 + 0.05, 0.05)
  // 'USDC': 1,
  // 'zUSDC': 1,
  // 'ceUSDC': 1,
  // 'USDT': 1,
}).map(([symbol, amounts]) => {
  let coin = getCoinProfileBySymbol(symbol)!
  return { [symbol]: amounts.map(amount => new CoinAmount(coin, amount * 10 ** coin.decimals)) }
}).reduce((prev, curr) => ({ ...curr, ...prev }), {})

const main = async () => {
  const alice = new AptosAccount(
    // https://explorer.aptoslabs.com/account/0x1263f531295b3f1ad50789a33e97ad3e8e0cc71e183c1ad89398dc227017ff70
    new HexString('f22b898d75932d428337e8aa8e35f36e53acc40cf4987ac203ab668cd3e04a7d').toUint8Array()
  );

  const simkeys: SimulationKeys = {
    pubkey: alice.pubKey(),
    address: alice.address(),
  };

  let poolGraph = await getPoolGraph()


  Object.values(maxSourceCoinAmountRecord).forEach(async maxSourceCoinAmount => {
    let res = await arbitrageCoinAmount(
      poolGraph,
      maxSourceCoinAmount,
      simkeys,
    )
    let sourceCoinAmount = res.quote.fromCoin
    let targetCoinAmount = res.quote.toCoin
    let { aptDiff, aptGas } = res
    console.log(
      sourceCoinAmount.coinInfo.symbol, sourceCoinAmount.amount.toPrecision(6),
      '>',
      targetCoinAmount.coinInfo.symbol, targetCoinAmount.amount.toPrecision(6),
      '-',
      'gas', aptGas.amount.toPrecision(6),
      '...',
      aptDiff.amount.toNumber()
    )
    if (res.aptDiff.amount.gt(0)) {
      const r = await ResultAsync
        .fromPromise(signAndSubmitTransaction(
          aptosClient(),
          alice,
          res.payload,
        ), (e) => e as any);
      console.log(r)
    } else {
      console.log('put off')
    }
  })
}

main()