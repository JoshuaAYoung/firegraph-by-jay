import React, { useState } from 'react';

const FGContext = React.createContext(null);

export default FGContext;

export const FGContextProvider = ({ children }) => {
  const [csvRawArray, setCsvRawArray] = useState([]);
  const [csvParsedArray, setCsvParsedArray] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [graphOptions, setGraphOptions] = useState(null);

  const value = {
    csvRawArray,
    setCsvRawArray,
    csvParsedArray,
    setCsvParsedArray,
    analysisData,
    setAnalysisData,
    graphOptions,
    setGraphOptions,
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
