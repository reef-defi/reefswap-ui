import { TOKENS_ADD_TOKEN } from "../actionCreator";

export interface Token {
  address: string;
  name: string;
}

interface AddToken {
  type: typeof TOKENS_ADD_TOKEN,
  token : Token;
}

export type TokensAction = 
  | AddToken;

export const addToken = (address: string, name: string): AddToken => ({
  type: TOKENS_ADD_TOKEN,
  token: {
    address,
    name,
  }
})