import { Token } from '@reef-defi/react-lib';
import { ADD_TOKEN, SET_ALL_TOKENS } from '../actionCreator';
import { TokensAction } from '../actions/tokens';

export interface TokensReducer {
  tokens: Token[];
}

const defaultTokensReducer: TokensReducer = {
  tokens: [],
};

export const tokensReducer = (state = defaultTokensReducer, action: TokensAction): TokensReducer => {
  switch (action.type) {
    case ADD_TOKEN: return { ...state, tokens: [...state.tokens, { ...action.token }] };
    case SET_ALL_TOKENS: return { ...state, tokens: [...action.tokens] };
    default: return state;
  }
};
