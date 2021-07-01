import { combineReducers } from 'redux';
import { TokensReducer, tokensReducer } from './tokens';
import { utilsReducer, UtilsReducer } from './accounts';
import { SettingsReducer, settingsReducer } from './settings';

const rootReducer = combineReducers({
  accounts: utilsReducer,
  tokens: tokensReducer,
  settings: settingsReducer,
});

export interface ReducerState {
  accounts: UtilsReducer;
  tokens: TokensReducer;
  settings: SettingsReducer;
}

export default rootReducer;
