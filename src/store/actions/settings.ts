import { Provider } from '@reef-defi/evm-provider';
import { AvailableNetworks } from '../../api/rpc/rpc';
import { RELOAD_APP, SET_CHAIN_URL, SET_PROVIDER } from '../actionCreator';

interface SetNetworkAction {
  type: typeof SET_CHAIN_URL;
  name: AvailableNetworks;
}

interface SetProviderAction {
  type: typeof SET_PROVIDER;
  provider: Provider;
}

interface ReloadAction {
  type: typeof RELOAD_APP;
}

export type SettingsActions =
  | ReloadAction
  | SetNetworkAction
  | SetProviderAction;

export const appReload = (): ReloadAction => ({
  type: RELOAD_APP
});

export const settingsSetProvider = (provider: Provider): SetProviderAction => ({
  type: SET_PROVIDER,
  provider
});

export const settingsSetNetwork = (name: AvailableNetworks): SetNetworkAction => ({
  type: SET_CHAIN_URL,
  name,
});
