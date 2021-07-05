import { ReefChains } from '../../api/api';
import { SET_CHAIN_URL, SET_RELOAD_BALANCE } from '../actionCreator';
import { SettingsActions } from '../actions/settings';

export interface SettingsReducer {
  chainUrl: string;
  reloadBalance: boolean;
}

const defaultSettings: SettingsReducer = {
  chainUrl: ReefChains.Testnet, // TODO change into mainnet url
  reloadBalance: false,
};

export const settingsReducer = (state = defaultSettings, action: SettingsActions): SettingsReducer => {
  switch (action.type) {
    case SET_CHAIN_URL: return { ...state, chainUrl: action.url};
    case SET_RELOAD_BALANCE: return { ...state, reloadBalance: action.reloadBalance };
    default: return state;
  }
};
