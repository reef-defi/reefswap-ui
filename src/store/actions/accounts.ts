import { Signer, TestAccountSigningKey } from '@reef-defi/evm-provider';
import {
  SET_ACCOUNT,
  SET_ACCOUNTS, SET_SELECTED_ACCOUNT, SET_SIGNING_KEY,
} from '../actionCreator';

export interface ReefswapSigner {
  signer: Signer;
  name: string;
  address: string;
  evmAddress: string;
  isEvmClaimed: boolean;
}

interface SetAccountsAction {
  type: typeof SET_ACCOUNTS;
  accounts: ReefswapSigner[];
}

interface SetSelectedAccount {
  type: typeof SET_SELECTED_ACCOUNT;
  index: number;
}

interface SetAccountAction {
  type: typeof SET_ACCOUNT;
  index: number;
  signer: ReefswapSigner;
}

interface SetSigningKeyAction {
  type: typeof SET_SIGNING_KEY;
  signingKey: TestAccountSigningKey;
}

export type UtilsActions =
  | SetAccountAction
  | SetAccountsAction
  | SetSigningKeyAction
  | SetSelectedAccount;


export const settingsSetAccount = (signer: ReefswapSigner, index: number): SetAccountAction => ({
  type: SET_ACCOUNT,
  index,
  signer
});

export const settingsSetSigningKey = (signingKey: TestAccountSigningKey): SetSigningKeyAction => ({
  type: SET_SIGNING_KEY,
  signingKey
});

export const utilsSetAccounts = (accounts: ReefswapSigner[]): SetAccountsAction => ({
  type: SET_ACCOUNTS,
  accounts,
});

export const utilsSetSelectedAccount = (index: number): SetSelectedAccount => ({
  type: SET_SELECTED_ACCOUNT,
  index,
});
