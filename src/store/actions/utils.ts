import { Signer } from '@reef-defi/evm-provider';
import {
  UTILS_SET_ACCOUNTS, UTILS_SET_IS_LOADED, UTILS_SET_SELECTED_ACCOUNT,
} from '../actionCreator';

export interface ReefswapSigner {
  signer: Signer;
  name: string;
  address: string;
  isEvmClaimed: boolean;
}

interface SetAccountsAction {
  type: typeof UTILS_SET_ACCOUNTS;
  accounts: ReefswapSigner[];
}

interface SetIsLoadingAction {
  type: typeof UTILS_SET_IS_LOADED;
  isLoaded: boolean;
}

interface SetSelectedAccount {
  type: typeof UTILS_SET_SELECTED_ACCOUNT;
  index: number;
}

export type UtilsActions =
  | SetAccountsAction
  | SetIsLoadingAction
  | SetSelectedAccount;


export const utilsSetAccounts = (accounts: ReefswapSigner[]): SetAccountsAction => ({
  type: UTILS_SET_ACCOUNTS,
  accounts,
});

export const utilsSetIsLoaded = (isLoaded: boolean): SetIsLoadingAction => ({
  type: UTILS_SET_IS_LOADED,
  isLoaded,
});

export const utilsSetSelectedAccount = (index: number): SetSelectedAccount => ({
  type: UTILS_SET_SELECTED_ACCOUNT,
  index,
});
