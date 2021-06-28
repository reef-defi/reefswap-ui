import { TOKENS_ADD_TOKEN, TOKENS_UPDATE_TOKEN_BALANCE } from "../actionCreator";
import { Token, TokensAction } from "../actions/tokens";

export interface TokensReducer {
  tokens: Token[];
}

export const defaultReefToken: Token = {
  name: "REEF", 
  address: "0x0000000000000000000000000000000001000000",
  balance: "",
};

export const defaultRUSDToken: Token = {
  name: "RUSD",
  address: "0x0000000000000000000000000000000001000001",
  balance: "",
}

const defaultTokensReducer: TokensReducer = {
  tokens: [{...defaultReefToken}, {...defaultRUSDToken}]
};

export const tokensReducer = (state=defaultTokensReducer, action: TokensAction): TokensReducer => {
  switch (action.type) {
    case TOKENS_ADD_TOKEN: return {...state, tokens: [...state.tokens, {...action.token}]};
    case TOKENS_UPDATE_TOKEN_BALANCE:
      return {...state,
        tokens: [
          ...state.tokens.slice(0, action.index), 
          {...state.tokens[action.index], balance: action.balance},
          ...state.tokens.slice(action.index+1),
        ]
      };
    default: return state;
  }
}