import { ReefNetwork, reefNetworks } from "../../api/rpc/rpc";
import { RELOAD_APP, SET_CHAIN_URL } from "../actionCreator";
import { SettingsActions } from "../actions/settings";

export interface SettingsReducer extends ReefNetwork {
  reload: boolean;
}

const defaultSettings: SettingsReducer = {
  ...reefNetworks.mainnet,
  graphqlUrl: reefNetworks.mainnet.graphqlUrl.replace("wss", "https"),
  reload: false,
};

export const settingsReducer = (
  state = defaultSettings,
  action: SettingsActions
): SettingsReducer => {
  switch (action.type) {
    case RELOAD_APP:
      return { ...state, reload: !state.reload };
    case SET_CHAIN_URL:
      return {
        ...state,
        ...reefNetworks[action.name],
        graphqlUrl: reefNetworks[action.name].graphqlUrl.replace(
          "wss",
          "https"
        ),
      };
    default:
      return state;
  }
};
