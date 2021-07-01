import { ReefChains } from '../../api/api';
import { SET_CHAIN_IS_LOADED, SET_CHAIN_URL, SET_RELOAD_BALANCE } from '../actionCreator';
import { SettingsActions } from '../actions/settings';

export interface SettingsReducer {
  chainUrl: string;
  reloadBalance: boolean;
  isChainLoaded: boolean;
}

const defaultSettings: SettingsReducer = {
  chainUrl: ReefChains.Testnet, // TODO change into mainnet url
  isChainLoaded: false,
  reloadBalance: false,
};

export const settingsReducer = (state = defaultSettings, action: SettingsActions): SettingsReducer => {
  switch (action.type) {
    case SET_CHAIN_URL: return { ...state, chainUrl: action.url, isChainLoaded: false };
    case SET_CHAIN_IS_LOADED: return { ...state, isChainLoaded: true };
    case SET_RELOAD_BALANCE: return { ...state, reloadBalance: action.reloadBalance };
    default: return state;
  }
};
