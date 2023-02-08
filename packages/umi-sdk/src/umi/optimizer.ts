import Decimal from "decimal.js";
import zip from "just-zip-it";
import { CoinProfile } from "../../../../apps/ui/src/config/coinList";
import { CoinAmount } from "../CoinAmount";
import { getSubArrays } from "../integerPartition";
import { CalcOutputAmount, PoolStatus, PriceQuote } from "../types";
import { curveConstantProduct } from "./curves";

let calcOutputAmountWithWeights = (
  inputCoinAmount: CoinAmount,
  pools: PoolStatus[],
  weights: number[]
): Decimal => {
  let rr = zip(pools, weights).map(([pool, weight]) => {
    const { outputCoinAmount, fees } = pool.calcOutputAmount(
      new CoinAmount(
        inputCoinAmount.coinInfo,
        inputCoinAmount.amount.mul(weight)
      ),
      pool
    );
    return outputCoinAmount;
  });
  let outputAmount = rr.reduce(
    (prev, curr) => prev.add(curr.amount),
    new Decimal(0)
  );
  return outputAmount;
};

export const clacOutputAmountCuveConstatProduct: CalcOutputAmount = (
  inputAmount,
  poolInfo
) => {
  // (x+dx)(y-dy) = k
  // dy = y - x*y / (x+dx)
  let sourceReserve: Decimal, targetReserve: Decimal;
  let coinTarget: CoinProfile;
  if (poolInfo.pair.coinX.coinInfo.type === inputAmount.coinInfo.type) {
    sourceReserve = poolInfo.pair.coinX.amount;
    targetReserve = poolInfo.pair.coinY.amount;
    coinTarget = poolInfo.pair.coinY.coinInfo;
  } else {
    targetReserve = poolInfo.pair.coinX.amount;
    sourceReserve = poolInfo.pair.coinY.amount;
    coinTarget = poolInfo.pair.coinX.coinInfo;
  }

  let delta_source = inputAmount.amount;
  let delta_target = curveConstantProduct(
    delta_source,
    sourceReserve,
    targetReserve
  );
  let outputCoinAmount = new CoinAmount(coinTarget, delta_target);

  return {
    outputCoinAmount,
    fees: [],
  };
};

export class SwapStep {
  source: CoinProfile;
  target: CoinProfile;
  pools: PoolStatus[];
  optimalPoolsAndWeightsByInputAmount: Record<
    string,
    {
      poolIdxs: number[];
      weights: number[];
    }
  >;
  weightComboList: number[][];
  subIdxs: number[][];
  prediction?: {
    inputAmount: Decimal;
    outputAmount: Decimal;
    weights: number[];
  };

  constructor(
    source: CoinProfile,
    target: CoinProfile,
    pools: PoolStatus[],
    weightComboList: number[][],
    n_split: number = 2
  ) {
    this.source = source;
    this.target = target;
    this.pools = pools;
    this.optimalPoolsAndWeightsByInputAmount = {};
    this.weightComboList = weightComboList;
    this.subIdxs = getSubArrays([...Array(pools.length).keys()]).filter(
      (arr) => arr.length === n_split
    );
  }

  public async fit(inputCoinAmount: CoinAmount): Promise<CoinAmount> {
    let maxOutputAmountSoFar = new Decimal(0);
    let optimalPoolsAndWeights = {
      poolIdxs: [] as number[],
      weights: [] as number[],
    };
    let poolIdxsAndWeightsPairList = this.subIdxs.flatMap((idxs) =>
      this.weightComboList.map((weights) => [idxs, weights])
    );

    await Promise.all(
      poolIdxsAndWeightsPairList.map(async ([poolIdxs, weights]) => {
        const selectedPools = poolIdxs.map((idx) => this.pools[idx]);
        let outputAmount = await calcOutputAmountWithWeights(
          inputCoinAmount,
          selectedPools,
          weights
        );

        if (outputAmount.gt(maxOutputAmountSoFar)) {
          maxOutputAmountSoFar = outputAmount;
          optimalPoolsAndWeights = { poolIdxs, weights };
        }
      })
    );

    this.optimalPoolsAndWeightsByInputAmount = {
      ...this.optimalPoolsAndWeightsByInputAmount,
      ...{
        [inputCoinAmount.amount.toFixed()]: optimalPoolsAndWeights,
      },
    };

    return new CoinAmount(this.target, maxOutputAmountSoFar);
  }

  public async predict(inputCoinAmount: CoinAmount): Promise<CoinAmount> {
    let { poolIdxs, weights } =
      this.optimalPoolsAndWeightsByInputAmount[
        inputCoinAmount.amount.toFixed() as string
      ];
    const selectedPools = poolIdxs.map((idx) => this.pools[idx]);
    let outputAmount = await calcOutputAmountWithWeights(
      inputCoinAmount,
      selectedPools,
      weights
    );
    return new CoinAmount(this.target, outputAmount);
  }

  public async toQuote(inputCoinAmount: CoinAmount): Promise<PriceQuote> {
    let { poolIdxs, weights } =
      this.optimalPoolsAndWeightsByInputAmount[
        inputCoinAmount.amount.toFixed() as string
      ];

    let routes = zip(poolIdxs, weights).map(([poolIdx, weight]) => {
      let pool = this.pools[poolIdx];
      let sourceCoinAmount = new CoinAmount(
        inputCoinAmount.coinInfo,
        inputCoinAmount.amount.mul(weight)
      );
      let { outputCoinAmount, fees } = pool.calcOutputAmount(
        sourceCoinAmount,
        pool
      );
      return {
        fromCoin: new CoinAmount(
          inputCoinAmount.coinInfo,
          inputCoinAmount.amount.mul(weight)
        ),
        toCoin: outputCoinAmount,
        part: new Decimal(weight),
        fee: fees[0],
        pool,
      } satisfies SwapInfo;
    });

    const selectedPools = poolIdxs.map((idx) => this.pools[idx]);
    let outputAmount = await calcOutputAmountWithWeights(
      inputCoinAmount,
      selectedPools,
      weights
    );
    let outputCoinAmount = new CoinAmount(this.target, outputAmount);

    return {
      fromCoin: inputCoinAmount,
      toCoin: outputCoinAmount,
      swapType: "split",
      swapRoute1: routes[0],
      swapRoute2: routes[1],
      swapRoute3: routes[2],
      price: inputCoinAmount.amount.div(outputCoinAmount.amount),
    } satisfies PriceQuote;
  }
}

export class SwapRouter {
  source: CoinProfile;
  target: CoinProfile;
  routes: SwapStep[][];
  weightsByInputAmount: Record<number, number[]>;
  prediction?: {
    inputAmount: Decimal;
    outputAmount: Decimal;
    weights: number[];
  };

  constructor(source: CoinProfile, target: CoinProfile, routes: SwapStep[][]) {
    this.source = source;
    this.target = target;
    this.routes = routes;
    this.weightsByInputAmount = {};
  }

  public async fit(inputAmount: Decimal) {
    const weightsVars = weightsBook[this.routes.length] as number[][];

    let maxOutputAmountSoFar = new Decimal(0);
    let optimalWeights: number[] = [];

    await Promise.all(
      weightsVars.map(async (weights) => {
        const outputAmount = await this._fit(inputAmount, weights);

        if (outputAmount.gt(maxOutputAmountSoFar)) {
          maxOutputAmountSoFar = outputAmount;
          optimalWeights = weights;
        }
      })
    );

    this.weightsByInputAmount = {
      ...this.weightsByInputAmount,
      ...{
        [inputAmount.toFixed()]: optimalWeights,
      },
    };

    return maxOutputAmountSoFar;
  }

  public optimialWeights(inputAmount: Decimal) {
    const weights = this.weightsByInputAmount[
      inputAmount.toFixed()
    ] as number[];
    return weights;
  }

  public async predict(inputAmount: Decimal) {
    const weights = this.optimialWeights(inputAmount);
    let outputAmount = await this._predict(inputAmount, weights);
    this.prediction = {
      inputAmount,
      outputAmount,
      weights,
    };
    return outputAmount;
  }

  public async optimalRoute(inputAmount: Decimal) {
    const weights = this.optimialWeights(inputAmount);
    return this._optimalRoute(inputAmount, weights);
  }

  async _fit(inputAmount: Decimal, weights: number[]): Promise<Decimal> {
    let outputAmount = new Decimal(0);
    await Promise.all(
      weights.map(async (weight, i) => {
        const route = this.routes[i];
        let amount = inputAmount.mul(weight);
        for (const swapStep of route) {
          amount = await swapStep.fit(amount);
        }
        outputAmount = outputAmount.add(amount);
      })
    );

    return outputAmount;
  }

  async _predict(inputAmount: Decimal, weights: number[]): Promise<Decimal> {
    let outputAmount = new Decimal(0);
    await Promise.all(
      weights.map(async (weight, i) => {
        const route = this.routes[i];
        let amount = inputAmount.mul(weight);
        for (const swapStep of route) {
          amount = await swapStep.predict(amount);
        }
        outputAmount = outputAmount.add(amount);
      })
    );

    return outputAmount;
  }

  async _optimalRoute(inputAmount: Decimal, weights: number[]) {
    let outputAmount = new Decimal(0);
    let weightsByStep: number[][] = [];
    await Promise.all(
      weights.map(async (weight, i) => {
        const route = this.routes[i];
        let amount = inputAmount.mul(weight);
        for (const swapStep of route) {
          let { outputAmount, weights } = await swapStep.optimalRoute(amount);
          weightsByStep.push(weights);
        }
        outputAmount = outputAmount.add(amount);
      })
    );

    return {
      outputAmount,
      weightsByStep,
    };
  }

  public print() {
    console.log(this.weightsByInputAmount);
    this.routes.forEach((route) => {
      route.forEach((step) => {
        console.log(step);
      });
    });
  }

  public print_prediction() {
    console.log(this.prediction);
    this.routes.forEach((route, i) => {
      route.forEach((step) => {
        step.print_prediction();
      });
    });
  }
}
