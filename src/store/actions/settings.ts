import { SET_CHAIN_URL } from "../actionCreator";

interface SetChainUrlAction {
  type: typeof SET_CHAIN_URL;
  url: string;
}

export type SettingsActions = 
  | SetChainUrlAction;

export const setChainUrl = (url: string): SetChainUrlAction => ({
  type: SET_CHAIN_URL,
  url
});