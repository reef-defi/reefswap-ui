import { ButtonStatus } from '../components/buttons/Button';

export const trim = (value: string, size = 19): string => (value.length < size
  ? value
  : `${value.slice(0, size - 5)}...${value.slice(value.length - 4)}`);

export const ensure = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message);
  }
};

export const uniqueCombinations = <T, >(array: T[]): [T, T][] => {
  const result: [T, T][] = [];
  for (let i = 0; i < array.length; i += 1) {
    for (let j = i + 1; j < array.length; j += 1) {
      result.push([array[i], array[j]]);
    }
  }
  return result;
};

export const errorStatus = (text: string): ButtonStatus => ({
  isValid: false,
  text,
});

export const ensureVoidRun = (canRun: boolean) => <I, >(fun: (obj: I) => void, obj: I) => {
  if (canRun) {
    fun(obj);
  }
};

export const dropDuplicates = <Obj, Key extends keyof Obj>(
  objects: Obj[],
  key: Key,
): Obj[] => {
  const existingKeys = new Set<Obj[Key]>();
  const filtered: Obj[] = [];

  for (let index = objects.length - 1; index >= 0; index -= 1) {
    const obj = objects[index];
    if (!existingKeys.has(obj[key])) {
      filtered.push(obj);
      existingKeys.add(obj[key]);
    }
  }

  return filtered;
};
