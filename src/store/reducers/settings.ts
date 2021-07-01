import { SET_CHAIN_URL } from "../actionCreator";
import { SettingsActions } from "../actions/settings";

export interface SettingsReducer {
  chainUrl: string;
}

const defaultSettings: SettingsReducer = {
  chainUrl: "" // TODO change into mainnet url
};

export const settingsReducer = (state=defaultSettings, action: SettingsActions): SettingsReducer => {
  switch (action.type) {
    case SET_CHAIN_URL: return {...state, chainUrl: action.url};
    default: return state;
  }
}