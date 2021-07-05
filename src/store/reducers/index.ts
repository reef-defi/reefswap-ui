import { combineReducers } from 'redux';
import { TokensReducer, tokensReducer } from './tokens';
import { utilsReducer, UtilsReducer } from './accounts';
import { SettingsReducer, settingsReducer } from './settings';
import { poolsReducer, PoolsReducer } from './pools';

const rootReducer = combineReducers({
  pools: poolsReducer,
  tokens: tokensReducer,
  accounts: utilsReducer,
  settings: settingsReducer,
});

export interface ReducerState {
  pools: PoolsReducer;
  tokens: TokensReducer;
  accounts: UtilsReducer;
  settings: SettingsReducer;
}

export default rootReducer;
