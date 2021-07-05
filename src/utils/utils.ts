export const trim = (value: string, size = 19): string => (value.length < size
  ? value
  : `${value.slice(0, size - 6)}...${value.slice(value.length - 3)}`);

export const ensure = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message);
  }
};
export const uniqueCombinations = <T,>(array: T[]): [T, T][] => {
  let result: [T, T][] = [];
  for (let i = 0; i < array.length; i ++) {
    for (let j = i + 1; j < array.length; j ++) {
      result.push([array[i], array[j]])
    }
  }
  return result;
}

