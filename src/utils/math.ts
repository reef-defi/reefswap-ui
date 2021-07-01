import BN from "bn.js";
import { Token, TokenWithAmount } from "../api/tokens";

const findDecimalPoint = (amount: string): number => {
  const {length} = amount;
  let index = amount.indexOf(",");
  if (index !== -1) { return length-index; }
  index = amount.indexOf(".");
  if (index !== -1) { return length-index; }
  return 0;
};

export const calculateAmount = (token: TokenWithAmount): string => {
  const {decimals, amount} = token;
  const addZeros = findDecimalPoint(amount);
  const cleanedAmount = amount.replaceAll(",", "").replaceAll(".", "");
  const result = new BN(cleanedAmount + "0".repeat(decimals-addZeros));
  return result.toString();
}

export const calculateBalance = ({decimals, balance}: Token): string => 
  balance.length < decimals
    ? "0"
    : balance.slice(0, balance.length-decimals) + 
      "," + 
      balance.slice(balance.length-decimals, balance.length-decimals+2);