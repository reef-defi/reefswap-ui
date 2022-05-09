import { Token } from '@reef-defi/react-lib';
import { ADD_TOKEN, SET_ALL_TOKENS } from '../actionCreator';

interface AddToken {
  type: typeof ADD_TOKEN;
  token : Token;
}

interface SetAllTokens {
  type: typeof SET_ALL_TOKENS,
  tokens: Token[]
}

export type TokensAction =
  | AddToken
  | SetAllTokens;

export const addTokenAction = (token: Token): AddToken => ({
  type: ADD_TOKEN,
  token,
});

export const setAllTokensAction = (tokens: Token[]): SetAllTokens => ({
  type: SET_ALL_TOKENS,
  tokens,
});
