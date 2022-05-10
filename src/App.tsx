import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

import { Provider as StoreProvider } from 'react-redux';
import {
  BrowserRouter as Router, Redirect, Route, Switch,
} from 'react-router-dom';
import NavBar from './components/navigation/NavBar';
import AppInitialization from './pages/AppInitialization';
import { store } from './store';
import { defaultSwapUrl, INITIALIZED_URLS, SETTINGS_URL } from './utils/urls';
import Settings from './pages/settings/Settings';

toast.configure();

const App = (): JSX.Element => (
  <div className="w-100 h-100 d-flex flex-column">
    <NavBar />

    <div className="container-fluid m-4 w-100 d-flex justify-content-center">
      <Switch>
        <Route path={INITIALIZED_URLS} component={AppInitialization}/>
        <Route exact path={SETTINGS_URL} component={Settings} />
        <Route path="/" render={() => <Redirect to={defaultSwapUrl}/>} />
      </Switch>
    </div>
  </div>
);

export default App;
