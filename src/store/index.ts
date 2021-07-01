import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  applyMiddleware, CombinedState, createStore, Store,
} from 'redux';
import rootReducer, { ReducerState } from './reducers';
import { TokensAction } from './actions/tokens';
import { UtilsActions } from './actions/accounts';
import { SettingsActions } from './actions/settings';

const middleware = [thunk];

type StoreType = Store<CombinedState<ReducerState>, TokensAction | UtilsActions | SettingsActions>

export const configureStore = (): StoreType => {
  const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middleware)),
  );
  return store;
};
