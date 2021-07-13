import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

import { Provider as StoreProvider } from 'react-redux';
import {
  BrowserRouter as Router, Redirect, Route, Switch,
} from 'react-router-dom';
import NavBar from './components/navigation/NavBar';
import AppInitialization from './pages/AppInitialization';
import { store } from './store';
import {
  INITIALIZED_URLS, SETTINGS_URL, SWAP_URL,
} from './utils/urls';
import Settings from './pages/settings/Settings';

toast.configure();

const App = (): JSX.Element => (
  <Router>
    <StoreProvider store={store}>
      <div className="w-100 h-100 d-flex flex-column">
        <NavBar />

        <div className="container-fluid mt-4 w-100">
          <div className="row justify-content-center">
            <div className="col-sm-10 col-md-6 col-lg-4 col-xl-3 field-size">
              <Switch>
                <Route path={INITIALIZED_URLS} component={AppInitialization} />
                <Route exact path={SETTINGS_URL} component={Settings} />
                <Route path="/" render={() => <Redirect to={SWAP_URL} />} />
              </Switch>
            </div>
          </div>
        </div>

        <ToastContainer
          draggable
          newestOnTop
          closeOnClick
          hideProgressBar
          position={toast.POSITION.BOTTOM_LEFT}
          autoClose={5000}
          rtl={false}
          pauseOnFocusLoss={false}
          pauseOnHover={false}
        />
      </div>
    </StoreProvider>
  </Router>
);

export default App;
