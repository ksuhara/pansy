
import { weightsListOfN } from './integerPartition';

const weightsBook = {
  1: weightsListOfN(1, 1),
  2: weightsListOfN(2, 5),
  3: weightsListOfN(3, 5),
  4: weightsListOfN(4, 5),
  5: weightsListOfN(5, 5),
  6: weightsListOfN(6, 1),
  7: weightsListOfN(7, 1),
  8: weightsListOfN(8, 1),
};

export interface Pool {
  name: string,
  coinX: string,
  coinY: string,
  reserveX: number,
  reserveY: number,
  calcAmountOutput: (inputX: number, reserveX: number, reserveY: number) => number
}

export const curveConstantProduct = (inputX: number, reserveX: number, reserveY: number) => {
  const fee = 0.003;
  const deltaX = inputX * (1 - fee);
  return reserveY - reserveX / (reserveX + deltaX);
};

export class SwapStep {
  source: string;
  target: string;
  pools: Pool[];
  weightsByInputAmount: Record<number, number[]>;

  constructor(source: string, target: string, pools: Pool[]) {
    this.source = source;
    this.target = target;
    this.pools = pools;
    this.weightsByInputAmount = {};
  }

  public fit(inputAmount: number) {
    const weightsVars = weightsBook[this.pools.length];

    let maxOutputAmountSoFar = 0;
    let optimalWeights = [];

    weightsVars.forEach(weights => {
      let outputAmount = 0;
      weights.forEach((weight, i) => {
        const pool = this.pools[i];
        outputAmount += pool.calcAmountOutput(
          weight * inputAmount,
          pool.reserveX,
          pool.reserveY,
        );
      });

      if (outputAmount > maxOutputAmountSoFar) {
        maxOutputAmountSoFar = outputAmount;
        optimalWeights = weights;
      }
    });

    this.weightsByInputAmount = {
      ...this.weightsByInputAmount,
      ...{
        [inputAmount]: optimalWeights
      },
    };

    return maxOutputAmountSoFar;
  }
}

export class SwapRouter {
  source: string;
  target: string;
  routes: SwapStep[][];
  weightsByInputAmount: Record<number, number[]>;

  constructor(source: string, target: string, routes: SwapStep[][]) {
    this.source = source;
    this.target = target;
    this.routes = routes;
    this.weightsByInputAmount = {};
  }

  public fit(inputAmount: number) {
    const weightsVars = weightsBook[this.routes.length];

    let maxOutputAmountSoFar = 0;
    let optimalWeights = [];

    weightsVars.forEach(weights => {
      const outputAmount = this._fit(inputAmount, weights);

      if (outputAmount > maxOutputAmountSoFar) {
        maxOutputAmountSoFar = outputAmount;
        optimalWeights = weights;
      }
    });

    this.weightsByInputAmount = {
      ...this.weightsByInputAmount,
      ...{
        [inputAmount]: optimalWeights
      },
    };

    return maxOutputAmountSoFar;
  }

  public predict(inputAmount: number): number {
    const weights = this.weightsByInputAmount[inputAmount];
    return this._predict(inputAmount, this.weightsByInputAmount[inputAmount]);
  }

  _fit(inputAmount: number, weights: number[]): number {
    let outputAmount = 0;
    weights.forEach((weight, i) => {
      const route = this.routes[i];
      let amount = weight * inputAmount;
      route.forEach(swapStep => {
        amount = swapStep.fit(amount);
      });
      outputAmount += amount;
    });

    return outputAmount;
  }

  _predict(inputAmount: number, weights: number[]): number {
    let outputAmount = 0;
    weights.forEach((weight, i) => {
      const route = this.routes[i];
      let amount = weight * inputAmount;
      route.forEach(swapStep => {
        amount = swapStep.fit(amount);
      });
      outputAmount += amount;
    });

    return outputAmount;
  }

  public print() {
    console.log(this.weightsByInputAmount);
    this.routes.forEach(route => {
      route.forEach(step => {
        console.log(step);
      });
    });
  }
}