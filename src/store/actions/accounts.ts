import { Signer } from '@reef-defi/evm-provider';
import {
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

export type UtilsActions =
  | SetAccountsAction
  | SetSelectedAccount;

export const utilsSetAccounts = (accounts: ReefswapSigner[]): SetAccountsAction => ({
  type: SET_ACCOUNTS,
  accounts,
});

export const utilsSetSelectedAccount = (index: number): SetSelectedAccount => ({
  type: SET_SELECTED_ACCOUNT,
  index,
});
