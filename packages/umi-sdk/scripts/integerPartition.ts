
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

export const paritionInteger = (target: number, maxLength: number) => {
  const partitions: number[][] = [];
  createPartitions(target, target, [], partitions);
  return partitions.filter(part => part.length <= maxLength);
};

export const paritionOne = (target: number, maxLength: number) => {
  const partionsList = paritionInteger(target, maxLength);
  return partionsList.map(arr => arr.map(n => n / target));
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

export const removeDuplicateArray = <T>(arrayOfArray: T[][]) => {
  return [... new Set(arrayOfArray.map(JSON.stringify))].map(JSON.parse);
};

// SHOULD BE n <= 7 because complexity
export const weightsListOfN = (len: number, denom_unit: number) => {
  const weightsList = paritionOne(denom_unit, len)
    .map(arr => {
      const weights = padArray(arr, len, 0);
      return permutations(weights);
    })
    .flat();
  return removeDuplicateArray(weightsList);
};