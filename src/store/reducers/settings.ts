import { ReefNetwork, reefNetworks } from '../../api/rpc/rpc';
import { SET_CHAIN_URL } from '../actionCreator';
import { SettingsActions } from '../actions/settings';

export interface SettingsReducer extends ReefNetwork {
  reloadBalance: boolean;
}

const defaultSettings: SettingsReducer = {
  ...reefNetworks.mainnet,
  reloadBalance: false,
};

export const settingsReducer = (state = defaultSettings, action: SettingsActions): SettingsReducer => {
  switch (action.type) {
    case SET_CHAIN_URL: return { ...state, ...reefNetworks[action.name] };
    default: return state;
  }
};
