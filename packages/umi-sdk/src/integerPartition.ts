import permutations from 'just-permutations';

const createPartitions = (target: number, maxValue: number, suffix, partitions) => {
  if (target === 0) {
    partitions.push(suffix);
  } else {
    if (maxValue > 1)
      createPartitions(target, maxValue - 1, suffix, partitions);
    if (maxValue <= target)
      createPartitions(target - maxValue, maxValue, [maxValue, ...suffix], partitions);
  }
};

export const paritionInteger = (denom_unit: number, maxLength: number) => {
  const partitions: number[][] = [];
  createPartitions(denom_unit, denom_unit, [], partitions);
  return partitions.filter(part => part.length <= maxLength);
};

export const paritionOne = (denom_unit: number, maxLength: number) => {
  const partionsList = paritionInteger(denom_unit, maxLength);
  return partionsList.map(arr => arr.map(n => n / denom_unit));
};

export const paritionOneWithPadZero = (target: number, maxLength: number) => {
  const partionsList = paritionInteger(target, maxLength);
  return partionsList.map(arr =>
    padArray(
      arr.map(n => n / target),
      5, 0
    )
  );
};

export const padArray = <T>(arr: T[], size: number, fill: any = null) => {
  return arr.concat(Array(size - arr.length).fill(fill));
};

export const paritionIntegerWithPadZero = (target: number, maxLength: number) => {
  const partionsList = paritionInteger(target, maxLength);
  return partionsList.map(arr => padArray(arr, maxLength, 0));
};

export const removeDuplicateArray = <T>(arrayOfArray: T[][]): T[][] => {
  return [... new Set(arrayOfArray.map(JSON.stringify))].map(JSON.parse);
};

// SHOULD BE n <= 7 because complexity
// (n_pool,  n_split, denom_unit) 
export const weightsListOfN = (n_pool: number, n_split: number, denom_unit: number) => {
  const weightsList = paritionOne(denom_unit, n_split)
    .map(arr => {
      const weights = padArray(arr, n_pool, 0);
      return permutations(weights);
    })
    .flat();
  return removeDuplicateArray(weightsList);
};

export const getSubArrays = <T>(arr: T[], cutoff=1): T[][] => {
  if (arr.length <= cutoff) return [arr];
  else {
    let subarr = getSubArrays(arr.slice(1));
    return subarr.concat(subarr.map(e => e.concat(arr[0])), [[arr[0]]]);
  }
};

export const getWeghtComboList = (n_split: number, denom_unit: number) => {
  let wsList = paritionOne(denom_unit, n_split)
    .filter(arr => arr.length === n_split)
    .flatMap(ws => permutations(ws));
  return removeDuplicateArray(wsList);

}