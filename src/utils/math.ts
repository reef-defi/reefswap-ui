import BN from 'bn.js';
import { Token, TokenWithAmount } from '../api/tokens';

const findDecimalPoint = (amount: string): number => {
  const { length } = amount;
  let index = amount.indexOf(',');
  if (index !== -1) { return length - index; }
  index = amount.indexOf('.');
  if (index !== -1) { return length - index; }
  return 0;
};

export const calculateAmount = (token: TokenWithAmount): string => {
  const { decimals, amount } = token;
  const addZeros = findDecimalPoint(amount);
  const cleanedAmount = amount.replaceAll(',', '').replaceAll('.', '');
  const result = new BN(cleanedAmount + '0'.repeat(Math.max(decimals - addZeros, 0)));
  return result.toString();
};

export const showBalance = ({ decimals, balance }: Token, decimalPoints=2): string => {
  if (balance === "0") { return balance;}
  const headLength = Math.max(balance.length - decimals, 0)
  const tailLength = Math.max(headLength + decimalPoints, 0);
  const head = balance.length < decimals ? '0' : balance.slice(0, headLength);
  const tail = balance.slice(headLength, tailLength); 
  return tail.length ? `${head},${tail}` : head;
}