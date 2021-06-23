import type { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';
import {Provider} from "@reef-defi/evm-provider";
import { createContext } from 'react';

export interface AppContext {
  provider: Provider;
  extension: InjectedExtension;
  accounts: InjectedAccountWithMeta[];
}

export const AppContext = createContext<AppContext|undefined>(undefined);

