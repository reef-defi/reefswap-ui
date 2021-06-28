import {combineReducers} from "redux";
import { TokensReducer, tokensReducer } from "./tokens";
import { utilsReducer, UtilsReducer } from "./utils";

const rootReducer = combineReducers({
  utils: utilsReducer,
  tokens: tokensReducer,
});

export interface ReducerState {
  utils: UtilsReducer;
  tokens: TokensReducer;
}

export default rootReducer;