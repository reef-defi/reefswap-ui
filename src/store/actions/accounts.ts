import { Signer } from '@reef-defi/evm-provider';
import {
  SET_ACCOUNT,
  SET_ACCOUNTS, SET_SELECTED_ACCOUNT,
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


export type UtilsActions =
  | SetAccountAction
  | SetAccountsAction
  | SetSelectedAccount;


export const accountsSetAccount = (signer: ReefswapSigner, index: number): SetAccountAction => ({
  type: SET_ACCOUNT,
  index,
  signer
});

export const accountsSetAccounts = (accounts: ReefswapSigner[]): SetAccountsAction => ({
  type: SET_ACCOUNTS,
  accounts,
});

export const accountsSetSelectedAccount = (index: number): SetSelectedAccount => ({
  type: SET_SELECTED_ACCOUNT,
  index,
});
