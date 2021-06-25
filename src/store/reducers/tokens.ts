import { TOKENS_ADD_TOKEN } from "../actionCreator";
import { Token, TokensAction } from "../actions/tokens";

export interface TokensReducer {
  tokens: Token[];
}

export const defaultReefToken: Token = {
  name: "Reef", 
  address: "0x0000000000000000000000000000000001000000"
};

export const defaultRUSDToken: Token = {
  name: "RUSD",
  address: "0x0000000000000000000000000000000001000001"
}

const defaultTokensReducer: TokensReducer = {
  tokens: [{...defaultReefToken}, {...defaultRUSDToken}]
};

export const tokensReducer = (state=defaultTokensReducer, action: TokensAction): TokensReducer => {
  switch (action.type) {
    case TOKENS_ADD_TOKEN: return {...state, tokens: [...state.tokens, {...action.token}]};
    default: return state;
  }
}