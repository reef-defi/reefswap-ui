import { TokenWithAmount, Token } from "../api/rpc/tokens";

const findDecimalPoint = (amount: string): number => {
  const { length } = amount;
  let index = amount.indexOf(',');
  if (index !== -1) { return length - index; }
  index = amount.indexOf('.');
  if (index !== -1) { return length - index; }
  return 0;
};

const transformAmount = (decimals: number, amount: string): string => {
  const addZeros = findDecimalPoint(amount);
  const cleanedAmount = amount.replaceAll(',', '').replaceAll('.', '');
  return cleanedAmount + '0'.repeat(Math.max(decimals - addZeros, 0));
};

export const calculateCurrencyAmount = (amount: string, fromPrice: number, toPrice: number): string => amount 
  ? (parseFloat(amount) * fromPrice / toPrice).toFixed(3)
  : "";

export const calculateAmount = ({ decimals, amount }: TokenWithAmount): string => transformAmount(decimals, amount);

export const calculateBalance = ({ balance, decimals }: Token): string => transformAmount(decimals, balance);

export const showBalance = ({ decimals, balance, name }: Token, decimalPoints = 4): string => {
  if (balance === '0') { return `${balance} ${name}`; }
  const headLength = Math.max(balance.length - decimals, 0);
  const tailLength = Math.max(headLength + decimalPoints, 0);
  const head = balance.length < decimals ? '0' : balance.slice(0, headLength);
  const tail = balance.slice(headLength, tailLength);
  return tail.length ? `${head}.${tail} ${name}` : `${head} ${name}`;
};
