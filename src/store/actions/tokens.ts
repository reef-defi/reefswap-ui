import { Token } from "../../api/tokens";
import { TOKENS_ADD_TOKEN, TOKENS_SET_ALL, TOKENS_UPDATE_TOKEN_BALANCE } from "../actionCreator";

interface AddToken {
  type: typeof TOKENS_ADD_TOKEN;
  token : Token;
}

interface UpdateTokenBalance {
  type: typeof TOKENS_UPDATE_TOKEN_BALANCE;
  index: number;
  balance: string;
}

interface SetAllTokens {
  type: typeof TOKENS_SET_ALL,
  tokens: Token[]
}

export type TokensAction = 
  | AddToken
  | SetAllTokens
  | UpdateTokenBalance;

export const addToken = (token: Token): AddToken => ({
  type: TOKENS_ADD_TOKEN,
  token
});

export const setAllTokens = (tokens: Token[]): SetAllTokens => ({
  type: TOKENS_SET_ALL,
  tokens,
})

export const updateTokenBalance = (index: number, balance: string): UpdateTokenBalance => ({
  type: TOKENS_UPDATE_TOKEN_BALANCE,
  index,
  balance,
});