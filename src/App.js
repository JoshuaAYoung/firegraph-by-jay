import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { usePDF } from 'react-to-pdf';
import NotFoundPage from './Views/NotFoundPage/NotFoundPage';
import ErrorBoundary from './ErrorBoundary';
import UploadForm from './Views/UploadForm/UploadForm';
import DataPage from './Views/DataPage/DataPage';
import Header from './Organisms/Header/Header';
import Footer from './Organisms/Footer/Footer';

const App = () => {
  const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });

  return (
    <div className="app" ref={targetRef}>
      <header className="navBar" role="banner">
        <ErrorBoundary>
          <Header downloadPDF={toPDF} />
        </ErrorBoundary>
      </header>
      <main className="appMain">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<UploadForm />} />
            <Route path="results" element={<DataPage />} />
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
