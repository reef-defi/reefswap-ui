import { Token } from '../../api/tokens';
import { TOKENS_ADD_TOKEN, TOKENS_SET_ALL, TOKENS_UPDATE_TOKEN_BALANCE } from '../actionCreator';
import { TokensAction } from '../actions/tokens';

export interface TokensReducer {
  tokens: Token[];
}

const defaultTokensReducer: TokensReducer = {
  tokens: [],
};

export const tokensReducer = (state = defaultTokensReducer, action: TokensAction): TokensReducer => {
  switch (action.type) {
    case TOKENS_ADD_TOKEN: return { ...state, tokens: [...state.tokens, { ...action.token }] };
    case TOKENS_SET_ALL: return { ...state, tokens: [...action.tokens] };
    case TOKENS_UPDATE_TOKEN_BALANCE:
      return {
        ...state,
        tokens: [
          ...state.tokens.slice(0, action.index),
          { ...state.tokens[action.index], balance: action.balance },
          ...state.tokens.slice(action.index + 1),
        ],
      };
    default: return state;
  }
};
