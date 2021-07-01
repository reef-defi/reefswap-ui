import {
  UTILS_SET_ACCOUNTS, UTILS_SET_IS_LOADED, UTILS_SET_SELECTED_ACCOUNT,
} from '../actionCreator';
import { ReefswapSigner, UtilsActions } from '../actions/utils';

export interface UtilsReducer {
  isLoaded: boolean;
  selectedAccount: number;
  accounts: ReefswapSigner[];
}

const defaultUtilsState: UtilsReducer = {
  isLoaded: false,
  selectedAccount: -1,
  accounts: [],
};

export const utilsReducer = (state = defaultUtilsState, action: UtilsActions): UtilsReducer => {
  switch (action.type) {
    case UTILS_SET_ACCOUNTS: return { ...state, accounts: action.accounts };
    case UTILS_SET_IS_LOADED: return { ...state, isLoaded: action.isLoaded };
    case UTILS_SET_SELECTED_ACCOUNT: return { ...state, selectedAccount: action.index };
    default: return state;
  }
};
