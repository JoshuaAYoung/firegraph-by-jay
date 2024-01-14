import React, { useMemo, useState } from 'react';

const FGContext = React.createContext(null);

export default FGContext;

export function FGContextProvider({ children }) {
  const defaultButtonTitle = 'Choose a file...';

  const [csvRawArray, setCsvRawArray] = useState([]);
  const [csvParsedArray, setCsvParsedArray] = useState([]);
  const [csvStringArray, setCsvStringArray] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [combinedChartData, setCombinedChartData] = useState([]);
  const [targetDuration, setTargetDuration] = useState(0);

  const [optionsTC, setOptionsTC] = useState([]);
  const [optionsOut, setOptionsOut] = useState([]);
  const [optionsSegments, setOptionsSegments] = useState([]);
  const [segmentLookupTable, setSegmentLookupTable] = useState([]);
  const [defaultTC, setDefaultTC] = useState([]);
  const [graphOptions, setGraphOptions] = useState({
    tcs: [],
    avg: true,
    align: '1',
    out: [],
  });
  const [globalErrorMessage, setGlobalErrorMessage] = useState('');
  const [firingNoteValue, setFiringNoteValue] = useState('');
  const [dataExpandedState, setDataExpandedState] = useState(null);
  const [uploadButtonArray, setUploadButtonArray] = useState([
    { title: defaultButtonTitle },
  ]);

  const resetState = () => {
    setCsvRawArray([]);
    setCsvParsedArray([]);
    setCsvStringArray([]);
    setAnalysisData(null);
    setCombinedChartData([]);
    setTargetDuration([]);
    setOptionsTC([]);
    setOptionsOut([]);
    setOptionsSegments([]);
    setSegmentLookupTable([]);
    setDefaultTC([]);
    setGraphOptions({ tcs: [], avg: true, align: '1', out: [] });
    setGlobalErrorMessage('');
    setFiringNoteValue('');
    setDataExpandedState(null);
    setUploadButtonArray([{ title: defaultButtonTitle }]);
  };

  // ugly but it works
  // linters complain if this isn't in a useMemo, and this was the only workaround
  // I could see other than to disable the rule
  const value = useMemo(
    () => ({
      csvRawArray,
      setCsvRawArray,
      csvParsedArray,
      setCsvParsedArray,
      csvStringArray,
      setCsvStringArray,
      analysisData,
      setAnalysisData,
      combinedChartData,
      setCombinedChartData,
      targetDuration,
      setTargetDuration,
      optionsTC,
      setOptionsTC,
      optionsOut,
      setOptionsOut,
      optionsSegments,
      setOptionsSegments,
      segmentLookupTable,
      setSegmentLookupTable,
      defaultTC,
      setDefaultTC,
      graphOptions,
      setGraphOptions,
      globalErrorMessage,
      setGlobalErrorMessage,
      firingNoteValue,
      setFiringNoteValue,
      dataExpandedState,
      setDataExpandedState,
      resetState,
      uploadButtonArray,
      setUploadButtonArray,
      defaultButtonTitle,
    }),
    [
      csvRawArray,
      setCsvRawArray,
      csvParsedArray,
      setCsvParsedArray,
      csvStringArray,
      setCsvStringArray,
      analysisData,
      setAnalysisData,
      combinedChartData,
      setCombinedChartData,
      targetDuration,
      setTargetDuration,
      optionsTC,
      setOptionsTC,
      optionsOut,
      setOptionsOut,
      optionsSegments,
      setOptionsSegments,
      segmentLookupTable,
      setSegmentLookupTable,
      defaultTC,
      setDefaultTC,
      graphOptions,
      setGraphOptions,
      globalErrorMessage,
      setGlobalErrorMessage,
      firingNoteValue,
      setFiringNoteValue,
      dataExpandedState,
      setDataExpandedState,
      resetState,
      uploadButtonArray,
      setUploadButtonArray,
      defaultButtonTitle,
    ],
  );

  return <FGContext.Provider value={value}>{children}</FGContext.Provider>;
}

export const useFGContext = () => {
  const fireGraphContext = React.useContext(FGContext);
  if (fireGraphContext === undefined) {
    throw new Error('fireGraphContext must be inside a FGContextProvider');
  }
  return fireGraphContext;
};
