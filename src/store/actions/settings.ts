import { SET_CHAIN_URL, SET_RELOAD_BALANCE } from '../actionCreator';

interface SetChainUrlAction {
  type: typeof SET_CHAIN_URL;
  url: string;
}

interface SetReloadBalanceAction {
  type: typeof SET_RELOAD_BALANCE,
  reloadBalance: boolean;
}

export type SettingsActions =
  | SetReloadBalanceAction
  | SetChainUrlAction;

export const settingsSetChainUrl = (url: string): SetChainUrlAction => ({
  type: SET_CHAIN_URL,
  url,
});

export const setReloadBalance = (reloadBalance: boolean): SetReloadBalanceAction => ({
  type: SET_RELOAD_BALANCE,
  reloadBalance,
});
