import {
  SET_ACCOUNT,
  SET_ACCOUNTS, SET_ACCOUNT_BALANCE, SET_SELECTED_ACCOUNT,
} from '../actionCreator';
import { ReefswapSigner, UtilsActions } from '../actions/accounts';

export interface UtilsReducer {
  selectedAccount: number;
  accounts: ReefswapSigner[];
  balance: string;
}

const defaultUtilsState: UtilsReducer = {
  selectedAccount: -1,
  accounts: [],
  balance: '- REEF',
};

export const utilsReducer = (state = defaultUtilsState, action: UtilsActions): UtilsReducer => {
  switch (action.type) {
    case SET_ACCOUNT: return {
      ...state,
      accounts: [
        ...state.accounts.slice(0, state.selectedAccount),
        action.signer,
        ...state.accounts.slice(state.selectedAccount + 1, state.accounts.length),
      ],
    };
    case SET_ACCOUNTS: return { ...state, accounts: action.accounts };
    case SET_ACCOUNT_BALANCE: return { ...state, balance: action.balance };
    case SET_SELECTED_ACCOUNT: return { ...state, selectedAccount: action.index };
    default: return state;
  }
};
