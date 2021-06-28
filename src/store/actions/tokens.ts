import { TOKENS_ADD_TOKEN, TOKENS_UPDATE_TOKEN_BALANCE } from "../actionCreator";

export interface Token {
  address: string;
  balance: string;
  name: string;
}

interface AddToken {
  type: typeof TOKENS_ADD_TOKEN;
  token : Token;
}

interface UpdateTokenBalance {
  type: typeof TOKENS_UPDATE_TOKEN_BALANCE;
  index: number;
  balance: string;
}

export type TokensAction = 
  | AddToken
  | UpdateTokenBalance;

export const addToken = (address: string, balance: string, name: string): AddToken => ({
  type: TOKENS_ADD_TOKEN,
  token: {
    address,
    balance,
    name,
  }
});

export const updateTokenBalance = (index: number, balance: string): UpdateTokenBalance => ({
  type: TOKENS_UPDATE_TOKEN_BALANCE,
  index,
  balance,
});