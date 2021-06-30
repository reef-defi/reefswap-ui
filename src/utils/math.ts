import BN from "bn.js";
import { Token } from "../api/tokens";
import { TokenWithAmount } from "../store/actions/tokens";

const findDecimalPoint = (amount: string): number => {
  const {length} = amount;
  let index = amount.indexOf(",");
  if (index !== -1) { return length-index; }
  index = amount.indexOf(".");
  if (index !== -1) { return length-index; }
  return 0;
};

export const calculateAmount = (token: TokenWithAmount): BN => {
  const {decimals, amount} = token;
  const addZeros = findDecimalPoint(amount);
  const cleanedAmount = amount.replaceAll(",", "").replaceAll(".", "");
  const result = cleanedAmount + "0".repeat(decimals-addZeros);
  return new BN(result);
}

export const calculateBalance = ({decimals, balance}: Token): string => 
  balance.length < decimals
    ? "0"
    : balance.slice(0, balance.length-decimals);