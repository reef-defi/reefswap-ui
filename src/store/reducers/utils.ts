import { UTILS_SET_ACCOUNTS, UTILS_SET_IS_LOADED, UTILS_SET_POLKADT_EXTENSION, UTILS_SET_PROVIDER, UTILS_SET_SELECTED_ACCOUNT } from "../actionCreator";
import { UtilsActions } from "../actions/utils";
import { Provider } from "@reef-defi/evm-provider";
import type { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';

export interface UtilsState {
  isLoaded: boolean;
  selectedAccount: number;
  extension?: InjectedExtension;
  accounts: InjectedAccountWithMeta[];
  provider?: Provider;
}

const defaultUtilsState: UtilsState = {
  isLoaded: false,
  selectedAccount: -1,
  accounts: [],
};

export const utilsReducer = (state=defaultUtilsState, action: UtilsActions): UtilsState => {
  switch (action.type) {
    case UTILS_SET_PROVIDER: return {...state, provider: action.provider};
    case UTILS_SET_ACCOUNTS: return {...state, accounts: action.accounts};
    case UTILS_SET_IS_LOADED: return {...state, isLoaded: action.isLoaded};
    case UTILS_SET_SELECTED_ACCOUNT: return {...state, selectedAccount: action.index};
    case UTILS_SET_POLKADT_EXTENSION: return {...state, extension: action.extension};
    default: return state; 
  }
}