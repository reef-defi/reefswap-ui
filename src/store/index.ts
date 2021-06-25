import rootReducer from "./reducers";
import thunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension";
import {applyMiddleware, createStore} from "redux";

const middleware = [thunk];

export function configureStore() {
  const store = createStore(
      rootReducer,
      composeWithDevTools(applyMiddleware(...middleware))
  );
  return store;
}