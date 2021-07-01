import { ReefChains } from "../../api/api";
import { SET_CHAIN_IS_LOADED, SET_CHAIN_URL } from "../actionCreator";
import { SettingsActions } from "../actions/settings";

export interface SettingsReducer {
  chainUrl: string;
  isChainLoaded: boolean;
}

const defaultSettings: SettingsReducer = {
  chainUrl: ReefChains.Testnet, // TODO change into mainnet url
  isChainLoaded: false,
};

export const settingsReducer = (state=defaultSettings, action: SettingsActions): SettingsReducer => {
  switch (action.type) {
    case SET_CHAIN_URL: return {...state, chainUrl: action.url, isChainLoaded: false};
    case SET_CHAIN_IS_LOADED: return {...state, isChainLoaded: true};
    default: return state;
  }
}