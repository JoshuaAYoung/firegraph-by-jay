import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import { FGContextProvider } from './context/FGContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <FGContextProvider>
        <App />
      </FGContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
