import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, createStore } from 'redux';
import rootReducer from './reducers';

const middleware = [thunk];

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware)),
);
export type ReducerState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
