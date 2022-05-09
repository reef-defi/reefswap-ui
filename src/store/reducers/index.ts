import { combineReducers } from 'redux';
import { tokensReducer } from './tokens';
import { utilsReducer } from './accounts';
import { settingsReducer } from './settings';

const rootReducer = combineReducers({
  tokens: tokensReducer,
  accounts: utilsReducer,
  settings: settingsReducer,
});
export default rootReducer;
