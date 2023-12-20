import React, { useMemo, useState } from 'react';

const FGContext = React.createContext(null);

export default FGContext;

export function FGContextProvider({ children }) {
  const [csvRawArray, setCsvRawArray] = useState([]);
  const [csvParsedArray, setCsvParsedArray] = useState([]);
  const [csvStringArray, setCsvStringArray] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [combinedChartData, setCombinedChartData] = useState([]);
  const [targetDuration, setTargetDuration] = useState(0);
  const [graphOptions, setGraphOptions] = useState({
    tcs: [],
    avg: true,
    align: '1',
    out: [],
  });

  const resetState = () => {
    setCsvRawArray([]);
    setCsvParsedArray([]);
    setAnalysisData(null);
    setGraphOptions({ tcs: [], avg: true, align: '1', out: [] });
    setCombinedChartData([]);
    setTargetDuration([]);
    setCsvStringArray([]);
  };

  const value = useMemo(
    () => ({
      csvRawArray,
      setCsvRawArray,
      csvParsedArray,
      setCsvParsedArray,
      analysisData,
      setAnalysisData,
      combinedChartData,
      targetDuration,
      setTargetDuration,
      setCombinedChartData,
      graphOptions,
      setGraphOptions,
      resetState,
      csvStringArray,
      setCsvStringArray,
    }),
    [
      csvRawArray,
      setCsvRawArray,
      csvParsedArray,
      setCsvParsedArray,
      analysisData,
      setAnalysisData,
      combinedChartData,
      targetDuration,
      setTargetDuration,
      setCombinedChartData,
      graphOptions,
      setGraphOptions,
      resetState,
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
