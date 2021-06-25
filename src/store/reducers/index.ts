import {combineReducers} from "redux";
import { utilsReducer, UtilsState } from "./utils";

const rootReducer = combineReducers({
  utils: utilsReducer
});

export interface ReducerState {
  utils: UtilsState;
}

export default rootReducer;