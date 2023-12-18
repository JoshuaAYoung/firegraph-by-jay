import React, { useState } from 'react';

const FGContext = React.createContext(null);

export default FGContext;

export const FGContextProvider = ({ children }) => {
  const [csvRawArray, setCsvRawArray] = useState([]);
  const [csvParsedArray, setCsvParsedArray] = useState([]);
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
  };

  const value = {
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
  };

  return <FGContext.Provider value={value}>{children}</FGContext.Provider>;
};

export const useFGContext = () => {
  const fireGraphContext = React.useContext(FGContext);
  if (fireGraphContext === undefined) {
    throw new Error('fireGraphContext must be inside a FGContextProvider');
  }
  return fireGraphContext;
};
