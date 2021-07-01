import { combineReducers } from 'redux';
import { TokensReducer, tokensReducer } from './tokens';
import { utilsReducer, UtilsReducer } from './accounts';

const rootReducer = combineReducers({
  accounts: utilsReducer,
  tokens: tokensReducer,
});

export interface ReducerState {
  accounts: UtilsReducer;
  tokens: TokensReducer;
}

export default rootReducer;
