import { Token } from '../../api/tokens';
import { ADD_TOKEN, RELOAD_TOKENS, SET_ALL_TOKENS } from '../actionCreator';
import { TokensAction } from '../actions/tokens';

export interface TokensReducer {
  tokens: Token[];
  reloadTokens: boolean;
}

const defaultTokensReducer: TokensReducer = {
  tokens: [],
  reloadTokens: true,
};

export const tokensReducer = (state = defaultTokensReducer, action: TokensAction): TokensReducer => {
  switch (action.type) {
    case ADD_TOKEN: return { ...state, tokens: [...state.tokens, { ...action.token }] };
    case SET_ALL_TOKENS: return { ...state, tokens: [...action.tokens], reloadTokens: false };
    case RELOAD_TOKENS: return { ...state, reloadTokens: true };
    default: return state;
  }
};
