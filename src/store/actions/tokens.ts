import { Token } from '../../api/tokens';
import { ADD_TOKEN, RELOAD_TOKENS, SET_ALL_TOKENS } from '../actionCreator';

interface AddToken {
  type: typeof ADD_TOKEN;
  token : Token;
}

interface SetAllTokens {
  type: typeof SET_ALL_TOKENS,
  tokens: Token[]
}

interface ReloadTokens {
  type: typeof RELOAD_TOKENS;
}

export type TokensAction =
  | AddToken
  | ReloadTokens
  | SetAllTokens;

export const addTokenAction = (token: Token): AddToken => ({
  type: ADD_TOKEN,
  token,
});

export const setAllTokensAction = (tokens: Token[]): SetAllTokens => ({
  type: SET_ALL_TOKENS,
  tokens,
});

export const reloadTokensAction = (): ReloadTokens => ({
  type: RELOAD_TOKENS,
});
