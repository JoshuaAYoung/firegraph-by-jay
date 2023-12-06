import React, { useEffect } from 'react';
import { CircularProgress } from '@mui/joy';
import { useFGContext } from '../../context/FGContext';
import analyzeCsv, { calculateActualRamp } from '../../Utils/csvUtils/csvUtils';
import LineGraph from '../../Organisms/LineGraph/LineGraph';
import './FiringGraph.css';

const FiringGraph = () => {
  const { csvArray, analysisData, setAnalysisData } = useFGContext();

  useEffect(() => {
    if (csvArray && !analysisData) {
      const analyzedData = analyzeCsv(csvArray);
      setAnalysisData(analyzedData);
    }
  }, []);

  useEffect(() => {
    console.log('analdata', analysisData);
    if (analysisData && analysisData.segments) {
      const segmentRampActual = [];
      analysisData.segments.forEach((segment) => {
        segmentRampActual.push(
          calculateActualRamp(
            segment.actualHalfMinutes,
            segment.startActualTemp,
            segment.endActualTemp,
            segment.number
          )
        );
        segmentRampActual.push({
          [`target${segment.number}`]: segment.targetRamp,
        });
      });
      console.log('actualramp', segmentRampActual);
    }
  }, [analysisData]);

  if (!analysisData) {
    return <CircularProgress />;
  }

  return (
    // Header with name of the program and the date
    <div className="graphContainer">
      <LineGraph />
    </div>
  );
};

export default FiringGraph;
