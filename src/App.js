import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import { usePDF } from 'react-to-pdf';
import { CssVarsProvider } from '@mui/joy/styles';
import { format } from 'date-fns';
import ReactGA from 'react-ga4';
import NotFoundPage from './Views/NotFoundPage/NotFoundPage';
import ErrorBoundary, { ErrorFallbackComponent } from './ErrorBoundary';
import UploadPAge from './Views/UploadPage/UploadPage';
import CsvPage from './Views/CsvPage/CsvPage';
import DataPage from './Views/DataPage/DataPage';
import Header from './Organisms/Header/Header';
import Footer from './Organisms/Footer/Footer';
import { theme } from './Theme/theme';
import { parseDateString } from './Utils/dateUtils/dateUtils';
import { useFGContext } from './context/FGContext';

function App() {
  const { analysisData } = useFGContext();
  const location = useLocation();

  let fileName = 'error_no_data';
  if (analysisData) {
    const { fileDate } = parseDateString(analysisData.startTime);
    const dateHandleEmpty = fileDate || format(new Date(), 'yyyy_MM_dd');
    fileName = `${dateHandleEmpty}_${analysisData.programName}`.replace(
      /[^a-zA-Z0-9\\.\\-\\_]/g,
      '_',
    );
  }

  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  // This has to live here as the targetRef is what's used as the pdf extents
  const { toPDF, targetRef } = usePDF({
    filename: `${fileName}.pdf`,
    page: { format: 'letter' },
  });

  return (
    <CssVarsProvider theme={theme}>
      <div className="app" ref={targetRef}>
        <header className="navBar" role="banner">
          <ErrorBoundary Fallback={ErrorFallbackComponent}>
            <Header downloadPDF={toPDF} />
          </ErrorBoundary>
        </header>
        <main className="appMain">
          <ErrorBoundary Fallback={ErrorFallbackComponent}>
            <Routes>
              <Route path="/" element={<UploadPAge />} />
              <Route path="results" element={<DataPage />} />
              <Route path="csv" element={<CsvPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <footer>
          <ErrorBoundary Fallback={ErrorFallbackComponent}>
            <Footer />
          </ErrorBoundary>
        </footer>
      </div>
    </CssVarsProvider>
  );
}

export default App;
