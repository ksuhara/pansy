import type { PriceType, QuoteType } from '@manahippo/hippo-sdk/dist/aggregator/types';
import type { CoinProfile } from '@manahippo/hippo-sdk/dist/generated/stdlib/coin';
import type { App } from '@manahippo/hippo-sdk/dist/generated/stdlib/guid';
import type { StructTag } from '@manahippo/move-to-ts';
import { parseMoveStructTag, u64 } from '@manahippo/move-to-ts';
import type { HexString, Types } from 'aptos';
import bigInt from 'big-integer';

type UITokenAmount = number;

class BigIntConstants {
  static ZERO = BigInt(0);

  static _1E0 = BigInt(1);
  static _1E1 = BigInt(10 ** 1);
  static _1E2 = BigInt(10 ** 2);
  static _1E3 = BigInt(10 ** 3);
  static _1E4 = BigInt(10 ** 4);
  static _1E5 = BigInt(10 ** 5);
  static _1E6 = BigInt(10 ** 6);
  static _1E7 = BigInt(10 ** 7);
  static _1E8 = BigInt(10 ** 8);
  static _1E9 = BigInt(10 ** 9);

  static TWO = BigInt(2);
  static ONE = BigInt(1);
}

type AptoswapSwapType = 'v2' | 'stable';
type AptoswapFeeDirection = 'X' | 'Y';

interface AptoswapCoinType {
  network: string;
  name: string;
}

interface AptoswapPoolType {
  xTokenType: AptoswapCoinType;
  yTokenType: AptoswapCoinType;
}

class AptoswapPoolInfo {
  static BPS_SCALING = BigInt('10000');

  type: AptoswapPoolType;
  typeString: string;

  index: number;
  swapType: AptoswapSwapType;

  x: bigint;
  y: bigint;
  lspSupply: bigint;

  feeDirection: AptoswapFeeDirection;

  freeze: boolean;

  adminFee: bigint;
  lpFee: bigint;
  incentiveFee: bigint;
  connectFee: bigint;
  withdrawFee: bigint;

  _fAdmin: number;
  _fLp: number;
  _aAdmin: number;
  _aLp: number;

  static mapResourceToPoolInfo = (resource: Types.MoveResource) => {
    try {
      const typeString = resource.type;
      const mtt = parseMoveStructTag(typeString);

      const xCoinType = {
        network: 'aptos',
        name: mtt.typeParams[0]
      } as AptoswapCoinType;

      const yCoinType = {
        network: 'aptos',
        name: mtt.typeParams[1]
      } as AptoswapCoinType;

      const data = resource.data as any;

      const poolType = { xTokenType: xCoinType, yTokenType: yCoinType } as AptoswapPoolType;
      const poolInfo = new AptoswapPoolInfo({
        type: poolType,
        typeString: typeString,

        index: Number(data.index),
        swapType: Number(data.pool_type) === 100 ? 'v2' : 'stable',

        x: BigInt(data.x.value),
        y: BigInt(data.y.value),
        lspSupply: BigInt(data.lsp_supply),

        feeDirection: Number(data.fee_direction) === 200 ? 'X' : 'Y',

        freeze: data.freeze,

        adminFee: BigInt(data.admin_fee),
        lpFee: BigInt(data.lp_fee),
        incentiveFee: BigInt(data.incentive_fee),
        connectFee: BigInt(data.connect_fee),
        withdrawFee: BigInt(data.withdraw_fee)
      });

      return poolInfo;
    } catch {}

    return null;
  };

  constructor({
    type,
    typeString,
    index,
    swapType,
    x,
    y,
    lspSupply,
    feeDirection,
    freeze,
    adminFee,
    lpFee,
    incentiveFee,
    connectFee,
    withdrawFee
  }: {
    type: AptoswapPoolType;
    typeString: string;
    index: number;
    swapType: AptoswapSwapType;
    x: bigint;
    y: bigint;
    lspSupply: bigint;
    feeDirection: AptoswapFeeDirection;
    freeze: boolean;
    adminFee: bigint;
    lpFee: bigint;
    incentiveFee: bigint;
    connectFee: bigint;
    withdrawFee: bigint;
  }) {
    this.type = type;
    this.typeString = typeString;
    this.index = index;
    this.swapType = swapType;
    this.x = x;
    this.y = y;
    this.lspSupply = lspSupply;
    this.feeDirection = feeDirection;
    this.freeze = freeze;
    this.adminFee = adminFee;
    this.lpFee = lpFee;
    this.incentiveFee = incentiveFee;
    this.connectFee = connectFee;
    this.withdrawFee = withdrawFee;

    this._fAdmin = Number(this.adminFee + this.connectFee) / 10000.0;
    this._fLp = Number(this.lpFee + this.incentiveFee) / 10000.0;
    this._aAdmin = 1.0 - this._fAdmin;
    this._aLp = 1.0 - this._fLp;
  }

  totalAdminFee = () => {
    return this.adminFee + this.connectFee;
  };

  totalLpFee = () => {
    return this.incentiveFee + this.lpFee;
  };

  isAvaliableForSwap = () => {
    if (this.freeze) {
      return false;
    } else if (this.x === BigIntConstants.ZERO || this.y === BigIntConstants.ZERO) {
      return false;
    }

    return true;
  };

  getPrice = () => {
    // Define with base token, since X is quote and Y is base
    // which is -1 / (dX / dY) = - dY / dX
    // As X * Y = K
    // ==> X * dY + Y * dX = 0
    // ==> - dY / dX = Y / X
    if (this.x === BigIntConstants.ZERO) return 0.0;
    return Number(this.y) / Number(this.x);
  };

  getPriceBuy = () => {
    // Excahnge y to x by taking fee
    return this.getPrice() / (this._aAdmin * this._aLp);
  };

  getPriceSell = () => {
    // Excahnge x to y by taking fee
    return this.getPrice() * (this._aAdmin * this._aLp);
  };

  getXToYAmount = (dx: bigint) => {
    const x_reserve_amt = this.x;
    const y_reserve_amt = this.y;

    if (this.feeDirection === 'X') {
      dx = dx - (dx * this.totalAdminFee()) / AptoswapPoolInfo.BPS_SCALING;
    }

    dx = dx - (dx * this.totalLpFee()) / AptoswapPoolInfo.BPS_SCALING;
    if (dx < BigIntConstants.ZERO) {
      return BigIntConstants.ZERO;
    }

    let dy = this._computeAmount(dx, x_reserve_amt, y_reserve_amt);
    if (this.feeDirection === 'Y') {
      dy = dy - (dy * this.totalAdminFee()) / AptoswapPoolInfo.BPS_SCALING;
    }

    return dy;
  };

  getYToXAmount = (dy: bigint) => {
    const x_reserve_amt = this.x;
    const y_reserve_amt = this.y;

    if (this.feeDirection === 'Y') {
      dy = dy - (dy * this.totalAdminFee()) / AptoswapPoolInfo.BPS_SCALING;
    }

    dy = dy - (dy * this.totalLpFee()) / AptoswapPoolInfo.BPS_SCALING;
    if (dy < BigIntConstants.ZERO) {
      return BigIntConstants.ZERO;
    }

    let dx = this._computeAmount(dy, y_reserve_amt, x_reserve_amt);
    if (this.feeDirection === 'X') {
      dx = dx - (dx * this.totalAdminFee()) / AptoswapPoolInfo.BPS_SCALING;
    }

    return dx;
  };

  getPriceBuyWithInput = (dy: bigint) => {
    const dx = this.getYToXAmount(dy);
    return Number(dy) / Number(dx);
  };

  getPriceSellWithInput = (dx: bigint) => {
    const dy = this.getXToYAmount(dx);
    return Number(dy) / Number(dx);
  };

  getPriceBuySlippage = (dy: bigint) => {
    // TODO: Refine swap slippage computation, which should be actual amount / target amount
    const amountActual = this.getYToXAmount(dy) * BigIntConstants._1E8;
    const amountExpect = (dy * this.x * BigIntConstants._1E8) / this.y;

    if (amountExpect === BigIntConstants.ZERO) {
      return 0.0;
    }

    let diff = amountExpect - amountActual;
    if (diff < BigIntConstants.ZERO) {
      diff = -diff;
    }

    return Number((diff * BigIntConstants._1E8) / amountExpect) / 10 ** 8;
  };

  getPriceSellSlippage = (dx: bigint) => {
    // TODO: Refine swap slippage computation, which should be actual amount / target amount
    // const priceActual = this.getPriceSellWithInput(dx);
    // const priceExpect = this.getPriceSell();
    // const slippage = Math.max(0.0, priceExpect - priceActual) / priceExpect;
    // return (!isNaN(slippage)) ? slippage : 0.0;

    const amountActual = this.getXToYAmount(dx) * BigIntConstants._1E8;
    const amountExpect = (dx * this.y * BigIntConstants._1E8) / this.x;

    if (amountExpect === BigIntConstants.ZERO) {
      return 0.0;
    }

    let diff = amountExpect - amountActual;
    if (diff < BigIntConstants.ZERO) {
      diff = -diff;
    }

    return Number((diff * BigIntConstants._1E8) / amountExpect) / 10 ** 8;
  };

  getXToYMinOutputAmount = (dx: bigint, slippage: number) => {
    const dy = this.getXToYAmount(dx);
    return (dy * BigInt(Math.round(10 ** 9 * (1.0 - slippage)))) / BigIntConstants._1E9;
  };

  getYToXMinOutputAmount = (dy: bigint, slippage: number) => {
    const dx = this.getYToXAmount(dy);
    return (dx * BigInt(Math.round(10 ** 9 * (1.0 - slippage)))) / BigIntConstants._1E9;
  };

  getDepositXAmount = (y: bigint) => {
    if (this.y === BigIntConstants.ZERO) {
      return BigIntConstants.ZERO;
    }
    return (this.x * y) / this.y;
  };

  getDepositYAmount = (x: bigint) => {
    if (this.x === BigIntConstants.ZERO) {
      return BigIntConstants.ZERO;
    }
    return (x * this.y) / this.x;
  };

  isInitialized = () => {
    return this.x > BigIntConstants.ZERO && this.y > BigIntConstants.ZERO;
  };

  _computeAmount = (dx: bigint, x: bigint, y: bigint) => {
    const numerator = y * dx;
    const denominator = x + dx;
    const dy = numerator / denominator;
    return dy;
  };
}

export class AptoswapTradingPool {
  packageAddr: HexString;
  _xCoinProfile: CoinProfile;
  _yCoinProfile: CoinProfile;
  tag: StructTag;
  pool: AptoswapPoolInfo;

  constructor(
    packageAddr: HexString,
    tag: StructTag,
    xCoinProfile: CoinProfile,
    yCoinProfile: CoinProfile,
    resource: Types.MoveResource
  ) {
    // super();
    this.packageAddr = packageAddr;
    this.tag = tag;
    this._xCoinProfile = xCoinProfile;
    this._yCoinProfile = yCoinProfile;

    const pool = AptoswapPoolInfo.mapResourceToPoolInfo(resource);
    if (pool === null) {
      throw Error('Error while parsing Aptoswap pool from resource');
    }
    this.pool = pool;
  }

  get dexType() {
    return DexType.Aptoswap;
  }
  get poolType() {
    return u64(0);
  } // ignored

  get isRoutable() {
    return true;
  }

  get xCoinProfile() {
    return this._xCoinProfile;
  }
  get yCoinProfile() {
    return this._yCoinProfile;
  }

  // state-dependent
  isStateLoaded(): boolean {
    return true;
  }

  async reloadState(app: App): Promise<void> {
    const resource = await app.client.getAccountResource(this.packageAddr, this.tag.getAptosMoveTypeTag());
    this.pool = AptoswapPoolInfo.mapResourceToPoolInfo(resource)!;
  }

  getPrice(): PriceType {
    const p = this.pool.getPrice();
    return {
      xToY: p > 0.0 ? 1.0 / p : 0.0,
      yToX: p > 0.0 ? p : 0.0
    };
  }

  getQuote(inputUiAmt: UITokenAmount, isXtoY: boolean): QuoteType {
    const inputTokenInfo = isXtoY ? this.xCoinProfile : this.yCoinProfile;
    const outputTokenInfo = isXtoY ? this.yCoinProfile : this.xCoinProfile;

    const coinInAmt = BigInt(Math.floor(inputUiAmt * Math.pow(10, inputTokenInfo.decimals.toJsNumber())));
    const coinOutAmt = isXtoY ? this.pool.getXToYAmount(coinInAmt) : this.pool.getYToXAmount(coinInAmt);
    const outputUiAmt = bigInt(coinOutAmt).toJSNumber() / Math.pow(10, outputTokenInfo.decimals.toJsNumber());

    return {
      inputSymbol: inputTokenInfo.symbol.str(),
      outputSymbol: outputTokenInfo.symbol.str(),
      inputUiAmt: inputUiAmt,
      outputUiAmt: outputUiAmt,
      avgPrice: outputUiAmt / inputUiAmt
    };
  }

  // build payload directly if not routable
  makePayload(inputUiAmt: UITokenAmount, minOutAmt: UITokenAmount): Types.EntryFunctionPayload {
    throw new Error('Not Implemented');
  }
}
