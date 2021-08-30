import { Token } from '../api/rpc/tokens';
import { BigNumber } from "ethers";

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

export const calculateCurrencyAmount = (amount: string, fromPrice: number, toPrice: number): string => (amount
  ? (parseFloat(amount) * fromPrice / toPrice).toFixed(3)
  : '');

interface CalculateAmount {
  decimals: number;
  amount: string;
}

export const calculateAmount = ({ decimals, amount }: CalculateAmount, percentage = 0): string => 
  BigNumber
    .from(transformAmount(decimals, amount))
    .mul(BigNumber.from(Math.round(100-percentage)))
    .div(BigNumber.from(100))
    .toString();

export const calculateBalance = ({ balance, decimals }: Token): string => transformAmount(decimals, balance.toString());

export const showBalance = ({ decimals, balance, name }: Token, decimalPoints = 4): string => {
  const balanceStr = balance.toString();
  if (balanceStr === '0') { return `${balanceStr} ${name}`; }
  const headLength = Math.max(balanceStr.length - decimals, 0);
  const tailLength = Math.max(headLength + decimalPoints, 0);
  const head = balanceStr.length < decimals ? '0' : balanceStr.slice(0, headLength);
  const tail = balanceStr.slice(headLength, tailLength);
  return tail.length ? `${head}.${tail} ${name}` : `${head} ${name}`;
};
