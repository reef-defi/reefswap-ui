import type { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';
import {Provider} from "@reef-defi/evm-provider";
import { createContext } from 'react';

export interface AppContext {
  provider: Provider;
  extension: InjectedExtension;
  accounts: InjectedAccountWithMeta[];
}

export const AppContext = createContext<AppContext|undefined>(undefined);

interface Token {
  address: string;
  name: string;
}

export interface TokenContext {
  tokens: Token[],
}

export const defaultTokenContext: TokenContext = {
  tokens: [
    {name: "Reef", address: "0x0000000000000000000000000000000001000000"},
    {name: "RUSD", address: "0x0000000000000000000000000000000001000001"},
  ]
} 

export const TokenContext = createContext<TokenContext>({...defaultTokenContext});
