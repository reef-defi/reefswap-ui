import { Signer } from '@reef-defi/evm-provider';
import {
  SET_ACCOUNT,
  SET_ACCOUNTS, SET_ACCOUNT_BALANCE, SET_SELECTED_ACCOUNT,
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

interface SetSelectedAccountAction {
  type: typeof SET_SELECTED_ACCOUNT;
  index: number;
}

interface SetAccountAction {
  type: typeof SET_ACCOUNT;
  signer: ReefswapSigner;
}

interface SetAccountBalanceAction {
  type: typeof SET_ACCOUNT_BALANCE;
  balance: string;
}

export type UtilsActions =
  | SetAccountAction
  | SetAccountsAction
  | SetAccountBalanceAction
  | SetSelectedAccountAction;

export const accountsSetAccount = (signer: ReefswapSigner): SetAccountAction => ({
  type: SET_ACCOUNT,
  signer,
});

export const accountsSetAccounts = (accounts: ReefswapSigner[]): SetAccountsAction => ({
  type: SET_ACCOUNTS,
  accounts,
});

export const accountsSetAccountBalance = (balance: string): SetAccountBalanceAction => ({
  type: SET_ACCOUNT_BALANCE,
  balance,
});

export const accountsSetSelectedAccount = (index: number): SetSelectedAccountAction => ({
  type: SET_SELECTED_ACCOUNT,
  index,
});
