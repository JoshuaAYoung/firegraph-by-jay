import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import NotFoundPage from './Views/NotFoundPage/NotFoundPage';
import ErrorBoundary from './ErrorBoundary';
import UploadForm from './Views/UploadForm/UploadForm';
import FiringGraph from './Views/FiringGraph/FiringGraph';
import Header from './Organisms/Header/Header';
import Footer from './Organisms/Footer/Footer';

const App = () => {
  return (
    <div className="app">
      <header className="navBar" role="banner">
        <ErrorBoundary>
          <Header />
        </ErrorBoundary>
      </header>
      <main className="appMain">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<UploadForm />} />
            <Route path="results" element={<FiringGraph />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <footer>
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
      </footer>
    </div>
  );
};

export default App;
