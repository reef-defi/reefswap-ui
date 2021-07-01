import { SET_CHAIN_IS_LOADED, SET_CHAIN_URL } from "../actionCreator";

interface SetChainUrlAction {
  type: typeof SET_CHAIN_URL;
  url: string;
}

interface SetChainIsLoadedAction {
  type: typeof SET_CHAIN_IS_LOADED,
}

export type SettingsActions = 
  | SetChainIsLoadedAction
  | SetChainUrlAction;

export const settingsSetChainUrl = (url: string): SetChainUrlAction => ({
  type: SET_CHAIN_URL,
  url
});

export const setChainIsLoaded = (): SetChainIsLoadedAction => ({
  type: SET_CHAIN_IS_LOADED
});