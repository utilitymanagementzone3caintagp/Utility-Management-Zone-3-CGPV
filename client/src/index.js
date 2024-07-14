import React from 'react'
import { Provider } from 'react-redux'
import 'core-js'
import ReactDOM from "react-dom/client";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContextProvider } from './context/AuthContext';
import { SearchContextProvider } from "./context/SearchContext";
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

import App from './App'
import store from './store'

if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <AuthContextProvider>
    <SearchContextProvider>
    <App />
    <ToastContainer />
    </SearchContextProvider>
    </AuthContextProvider>
  </Provider>,
)
