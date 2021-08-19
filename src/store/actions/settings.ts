import { AvailableNetworks } from '../../api/rpc/rpc';
import { SET_CHAIN_URL } from '../actionCreator';

interface SetNetworkAction {
  type: typeof SET_CHAIN_URL;
  name: AvailableNetworks;
}

export type SettingsActions =
  | SetNetworkAction;

export const settingsSetNetwork = (name: AvailableNetworks): SetNetworkAction => ({
  type: SET_CHAIN_URL,
  name,
});
