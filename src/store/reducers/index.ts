import { combineReducers } from 'redux';
import { tokensReducer } from './tokens';
import { utilsReducer } from './accounts';
import { settingsReducer } from './settings';
import { poolsReducer } from './pools';

const rootReducer = combineReducers({
  pools: poolsReducer,
  tokens: tokensReducer,
  accounts: utilsReducer,
  settings: settingsReducer,
});
export default rootReducer;
