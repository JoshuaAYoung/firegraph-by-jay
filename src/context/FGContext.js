import React, { useState } from 'react';

const FGContext = React.createContext(null);

export default FGContext;

export const FGContextProvider = ({ children }) => {
  const [csvFile, setCsvFile] = useState(null);
  const [csvArray, setCsvArray] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [graphOptions, setGraphOptions] = useState(null);

  const value = {
    csvFile,
    setCsvFile,
    csvArray,
    setCsvArray,
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
