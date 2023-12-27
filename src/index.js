import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import * as ReactDOM from 'react-dom/client';
import ReactGA from 'react-ga4';
import App from './App';
import { FGContextProvider } from './context/FGContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

ReactGA.initialize('G-B13PTQ8K33');

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <FGContextProvider>
        <App />
      </FGContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
