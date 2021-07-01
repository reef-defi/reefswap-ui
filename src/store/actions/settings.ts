import { SET_CHAIN_IS_LOADED, SET_CHAIN_URL, SET_RELOAD_BALANCE } from '../actionCreator';

interface SetChainUrlAction {
  type: typeof SET_CHAIN_URL;
  url: string;
}

interface SetChainIsLoadedAction {
  type: typeof SET_CHAIN_IS_LOADED,
}

interface SetReloadBalanceAction {
  type: typeof SET_RELOAD_BALANCE,
  reloadBalance: boolean;
}

export type SettingsActions =
  | SetChainIsLoadedAction
  | SetReloadBalanceAction
  | SetChainUrlAction;

export const settingsSetChainUrl = (url: string): SetChainUrlAction => ({
  type: SET_CHAIN_URL,
  url,
});

export const setChainIsLoaded = (): SetChainIsLoadedAction => ({
  type: SET_CHAIN_IS_LOADED,
});

export const setReloadBalance = (reloadBalance: boolean): SetReloadBalanceAction => ({
  type: SET_RELOAD_BALANCE,
  reloadBalance,
});
