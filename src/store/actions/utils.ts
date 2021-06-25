import { UTILS_SET_ACCOUNTS, UTILS_SET_IS_LOADED, UTILS_SET_POLKADT_EXTENSION, UTILS_SET_PROVIDER } from "../actionCreator";
import { Provider } from "@reef-defi/evm-provider";
import type { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';

interface SetProviderAction {
  type: typeof UTILS_SET_PROVIDER;
  provider: Provider;
}

interface SetAccountsAction {
  type: typeof UTILS_SET_ACCOUNTS;
  accounts: InjectedAccountWithMeta[];
}

interface SetPolkadotExtensionAction {
  type: typeof UTILS_SET_POLKADT_EXTENSION;
  extension: InjectedExtension;
}

interface SetIsLoadingAction {
  type: typeof UTILS_SET_IS_LOADED;
  isLoaded: boolean;
}

export type UtilsActions =
  | SetAccountsAction
  | SetProviderAction
  | SetIsLoadingAction
  | SetPolkadotExtensionAction;

export const utilsSetProvider = (provider: Provider): SetProviderAction => ({
  type: UTILS_SET_PROVIDER,
  provider
});

export const utilsSetAccounts = (accounts: InjectedAccountWithMeta[]): SetAccountsAction => ({
  type: UTILS_SET_ACCOUNTS,
  accounts
});

export const utilsSetIsLoaded = (isLoaded: boolean): SetIsLoadingAction => ({
  type: UTILS_SET_IS_LOADED,
  isLoaded
});

export const setPolkadotExtension = (extension: InjectedExtension): SetPolkadotExtensionAction => ({
  type: UTILS_SET_POLKADT_EXTENSION,
  extension
})