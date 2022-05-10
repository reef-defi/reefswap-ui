import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './assets/index.css';
import 'react-toastify/dist/ReactToastify.css';
import '@reef-defi/react-lib/dist/index.css';
import App1 from './App1';
import { store } from './store';
import {Provider as StoreProvider} from "react-redux";
import { BrowserRouter as Router } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <StoreProvider store={store}>
        <App1 />
       
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
      </StoreProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
