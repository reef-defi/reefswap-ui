import { Provider } from '@reef-defi/evm-provider';
import { AvailableNetworks } from '../../api/rpc/rpc';
import { RELOAD_APP, SET_CHAIN_URL } from '../actionCreator';

interface SetNetworkAction {
  type: typeof SET_CHAIN_URL;
  name: AvailableNetworks;
}

interface ReloadAction {
  type: typeof RELOAD_APP;
}

export type SettingsActions =
  | ReloadAction
  | SetNetworkAction;

export const appReload = (): ReloadAction => ({
  type: RELOAD_APP,
});

export const settingsSetNetwork = (name: AvailableNetworks): SetNetworkAction => ({
  type: SET_CHAIN_URL,
  name,
});
