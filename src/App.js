import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { usePDF } from 'react-to-pdf';
import { CssVarsProvider } from '@mui/joy/styles';
import { format } from 'date-fns';
import NotFoundPage from './Views/NotFoundPage/NotFoundPage';
import ErrorBoundary from './ErrorBoundary';
import UploadForm from './Views/UploadForm/UploadForm';
import DataPage from './Views/DataPage/DataPage';
import Header from './Organisms/Header/Header';
import Footer from './Organisms/Footer/Footer';
import { theme } from './Theme/theme';
import { parseDateString } from './Utils/dateUtils/dateUtils';
import { useFGContext } from './context/FGContext';

function App() {
  const { analysisData } = useFGContext();

  let fileName = 'error_no_data';
  if (analysisData) {
    const { fileDate } = parseDateString(analysisData.startTime);
    const dateHandleEmpty = fileDate || format(new Date(), 'yyyy_MM_dd');
    fileName = `${dateHandleEmpty}_${analysisData.programName}`.replace(
      /[^a-zA-Z0-9\\.\\-\\_]/g,
      '_',
    );
  }

  // This has to live here as the targetRef is what's used as the pdf extents
  const { toPDF, targetRef } = usePDF({
    filename: `${fileName}.pdf`,
    page: { format: 'letter' },
  });

  return (
    <CssVarsProvider theme={theme}>
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
    </CssVarsProvider>
  );
}

export default App;
