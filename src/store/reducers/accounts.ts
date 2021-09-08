import {
  SET_ACCOUNT,
  SET_ACCOUNTS, SET_SELECTED_ACCOUNT,
} from '../actionCreator';
import { ReefswapSigner, UtilsActions } from '../actions/accounts';

export interface UtilsReducer {
  selectedAccount: number;
  accounts: ReefswapSigner[];
}

const defaultUtilsState: UtilsReducer = {
  selectedAccount: -1,
  accounts: [],
};

export const utilsReducer = (state = defaultUtilsState, action: UtilsActions): UtilsReducer => {
  switch (action.type) {
    case SET_ACCOUNT: return {...state, 
      accounts: [
        ...state.accounts.slice(0, action.index),
        action.signer,
        ...state.accounts.slice(action.index+1, state.accounts.length)
      ]
    };
    case SET_ACCOUNTS: return { ...state, accounts: action.accounts };
    case SET_SELECTED_ACCOUNT: return { ...state, selectedAccount: action.index };
    default: return state;
  }
};
