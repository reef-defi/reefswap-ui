import { BigNumber } from 'ethers';
import { Token, TokenWithAmount } from '../api/rpc/tokens';
import { ReefswapPool } from '../api/rpc/pools';

const findDecimalPoint = (amount: string): number => {
  const { length } = amount;
  let index = amount.indexOf(',');
  if (index !== -1) { return length - index - 1; }
  index = amount.indexOf('.');
  if (index !== -1) { return length - index - 1; }
  return 0;
};

const transformAmount = (decimals: number, amount: string): string => {
  if (!amount) { return '0'; }
  const addZeros = findDecimalPoint(amount);
  const cleanedAmount = amount.replaceAll(',', '').replaceAll('.', '');
  return cleanedAmount + '0'.repeat(Math.max(decimals - addZeros, 0));
};

export const assertAmount = (amount: string): string => (!amount ? '0' : amount);

const convert2Normal = (decimals: number, inputAmount: string): number => {
  const amount = '0'.repeat(decimals + 4) + assertAmount(inputAmount);
  const pointer = amount.length - decimals;
  const decimalPointer = `${amount.slice(0, pointer)
  }.${
    amount.slice(pointer, amount.length)}`;
  return parseFloat(decimalPointer);
};

interface CalculateAmount {
  decimals: number;
  amount: string;
}

export const calculateAmount = ({ decimals, amount }: CalculateAmount): string => BigNumber
  .from(transformAmount(decimals, assertAmount(amount)))
  .toString();

export const calculateAmountWithPercentage = ({ amount: oldAmount, decimals }: CalculateAmount, percentage: number): string => {
  if (!oldAmount) { return '0'; }
  const amount = parseFloat(assertAmount(oldAmount)) * (1 - percentage / 100);
  return calculateAmount({ amount: amount.toString(), decimals });
};

export const minimumRecieveAmount = ({ amount }: CalculateAmount, percentage: number): number => parseFloat(assertAmount(amount)) * (100 - percentage) / 100;

interface CalculateUsdAmount extends CalculateAmount {
  price: number;
}
export const calculateUsdAmount = ({ amount, price }: CalculateUsdAmount): number => parseFloat(assertAmount(amount)) * price;

export const calculateDeadline = (minutes: number): number => Date.now() + minutes * 60 * 1000;

export const calculateBalance = ({ balance, decimals }: Token): string => transformAmount(decimals, balance.toString());

export const calculatePoolSupply = (token1: TokenWithAmount, token2: TokenWithAmount, pool?: ReefswapPool): number => {
  const amount1 = parseFloat(assertAmount(token1.amount));
  const amount2 = parseFloat(assertAmount(token2.amount));

  if (!pool) {
    return Math.sqrt(amount1 * amount2) - 0.000000000000001;
  }
  const totalSupply = convert2Normal(18, pool.totalSupply);
  const reserve1 = convert2Normal(token1.decimals, pool.reserve1);
  const reserve2 = convert2Normal(token2.decimals, pool.reserve2);

  return Math.min(
    amount1 * totalSupply / reserve1,
    amount2 * totalSupply / reserve2,
  );
};

export const calculatePoolShare = (pool?: ReefswapPool): number => {
  if (!pool) { return 0; }
  const totalSupply = convert2Normal(18, pool.totalSupply);
  const userSupply = convert2Normal(18, pool.userPoolBalance);
  return (userSupply) / totalSupply;
};

export const showBalance = ({ decimals, balance, name }: Token, decimalPoints = 4): string => {
  const balanceStr = balance.toString();
  if (balanceStr === '0') { return `${balanceStr} ${name}`; }
  const headLength = Math.max(balanceStr.length - decimals, 0);
  const tailLength = Math.max(headLength + decimalPoints, 0);
  const head = balanceStr.length < decimals ? '0' : balanceStr.slice(0, headLength);
  const tail = balanceStr.slice(headLength, tailLength);
  return tail.length ? `${head}.${tail} ${name}` : `${head} ${name}`;
};

export const toBalance = ({ balance, decimals }: Token): number => {
  const num = balance.toString();
  const diff = num.length - decimals;
  const fullNum = diff <= 0
    ? '0'
    : num.slice(0, diff);
  return parseFloat(`${fullNum}.${num.slice(diff, num.length)}`);
};

export const poolRatio = ({ token1, token2 }: ReefswapPool): number => toBalance(token2) / toBalance(token1);
