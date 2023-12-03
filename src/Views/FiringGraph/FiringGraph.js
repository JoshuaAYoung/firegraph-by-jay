import React, { useEffect, useState } from 'react';
import { Button, CircularProgress } from '@mui/joy';
import { useFGContext } from '../../context/FGContext';
import analyzeCsv, {calculateActualRamp} from '../../Utils/csvUtils/csvUtils';

const FiringGraph = () => {
  const { csvArray, analysisData, setAnalysisData} = useFGContext();

  useEffect(() => {
    console.log("useEffect", analysisData)
    if (csvArray && !analysisData) {
      console.log("running analysis");
      const analyzedData = analyzeCsv(csvArray);
      setAnalysisData(analyzedData);
    }
  }, []);

  useEffect(() => {
    console.log("analdata", analysisData)
    if (analysisData && analysisData.segments) {
      const segmentRampActual = [];
      analysisData.segments.forEach((segment) => {
        segmentRampActual.push(calculateActualRamp(segment.actualHalfMinutes, segment.startActualTemp, segment.endActualTemp, segment.number));
      })
      console.log("actualramp", segmentRampActual)
    }
  }, [analysisData]);

  // if (!analysisData) {
  //   return <CircularProgress />;
  // }

  return (
    <div className="uploadForm">
      <Button variant="contained" component="label">
        Upload File
        <input type="file" hidden />
      </Button>
    </div>
  );
};

export default FiringGraph;
