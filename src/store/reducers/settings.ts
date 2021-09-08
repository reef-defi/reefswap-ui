import { Provider } from '@reef-defi/evm-provider';
import { ReefNetwork, reefNetworks } from '../../api/rpc/rpc';
import { RELOAD_APP, SET_CHAIN_URL, SET_PROVIDER } from '../actionCreator';
import { SettingsActions } from '../actions/settings';

export interface SettingsReducer extends ReefNetwork {
  reload: boolean;
  provider?: Provider;
}

const defaultSettings: SettingsReducer = {
  ...reefNetworks.mainnet,
  reload: false,
};

export const settingsReducer = (state = defaultSettings, action: SettingsActions): SettingsReducer => {
  switch (action.type) {
    case RELOAD_APP: return {...state, reload: !state.reload};
    case SET_PROVIDER: return {...state, provider: action.provider};
    case SET_CHAIN_URL: return { ...state, ...reefNetworks[action.name] };
    default: return state;
  }
};
