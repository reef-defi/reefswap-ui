import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from './components/navigation/NavBar';
import AppInitialization from './pages/AppInitialization';
import { configureStore } from './store';

const store = configureStore();
toast.configure();

const App = (): JSX.Element => (
  <Router>
    <StoreProvider store={store}>
      <div className="w-100 h-100 d-flex flex-column">
        <NavBar />
        <AppInitialization />
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
