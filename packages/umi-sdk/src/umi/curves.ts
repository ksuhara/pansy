import Decimal from "decimal.js";


export const curveConstantProduct = (
  dx: Decimal,
  x: Decimal,
  y: Decimal,
) => {
  const dy = y.mul(dx).div(x.add(dx));
  return dy;
};