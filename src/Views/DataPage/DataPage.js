import React, { useEffect, useState } from 'react';
import { CircularProgress, Grid } from '@mui/joy';
import { FaTemperatureHigh } from 'react-icons/fa';
import { GiElectric } from 'react-icons/gi';
import { FaChartLine } from 'react-icons/fa6';
import { LuAlignStartVertical } from 'react-icons/lu';
import { useFGContext } from '../../context/FGContext';
import { analyzeCsv, calculateActualRamp } from '../../Utils/csvUtils/csvUtils';
import LineGraph from '../../Organisms/LineGraph/LineGraph';
import './DataPage.css';
import Select from '../../Molecules/Select/Select';

const DataPage = () => {
  // Hook(s)
  const {
    csvArray,
    analysisData,
    setAnalysisData,
    graphOptions,
    setGraphOptions,
  } = useFGContext();
  const [optionsTC, setOptionsTC] = useState([]);
  const [optionsOut, setOptionsOut] = useState([]);
  const [optionsSegments, setOptionsSegments] = useState([]);
  const [defaultTC, setDefaultTC] = useState([]);

  // Computed Var(s)
  const averageTempKeyArray = ['averageTemp1', 'averageTemp2', 'averageTemp3'];
  const averageOutKeyArray = ['averageOut1', 'averageOut2', 'averageOut3'];
  const optionsTCAverage = [
    { value: 'Average', title: 'Average Temps' },
    { value: 'Separate', title: 'Separate Lines' },
  ];

  // Effect(s)
  useEffect(() => {
    if (csvArray && !analysisData) {
      // analyze data from csv array
      const analyzedData = analyzeCsv(csvArray);
      setAnalysisData(analyzedData);

      // set the thermocouple and output select options on first render
      const optionsTCArray = [];
      const defaultTCArray = [];
      const optionsOutArray = [];

      averageTempKeyArray.forEach((key, index) => {
        if (key.includes('Temp') && analyzedData[key] !== 0) {
          optionsTCArray.push({
            value: index + 1,
            title: `TC${index + 1} (${analyzedData[key]}° avg.)`,
          });
          defaultTCArray.push(index + 1);
        }
      });

      averageOutKeyArray.forEach((key, index) => {
        if (key.includes('Out') && analyzedData[key] !== 0) {
          optionsOutArray.push({
            value: index + 1,
            title: `Out${index + 1} (${analyzedData[key]}% avg.)`,
          });
        }
      });

      const optionsSegmentsArray = analyzedData.segments.map((segment) => {
        return { value: segment.number, title: `Segment ${segment.number}` };
      });

      setOptionsTC(optionsTCArray);
      setDefaultTC(defaultTCArray);
      setOptionsOut(optionsOutArray);
      setOptionsSegments(optionsSegmentsArray);
      setGraphOptions({
        tcs: defaultTCArray,
        avg: true,
        align: optionsSegmentsArray[0].value,
        out: [],
      });
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
            segment.startActualTemp2,
            segment.endActualTemp2,
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

  // Function(s)
  const handleTCChange = (_event, newValue) => {
    setGraphOptions({ ...graphOptions, tcs: newValue.sort() });
  };

  const handleAvgChange = (_event, newValue) => {
    setGraphOptions({
      ...graphOptions,
      avg: newValue === 'Average',
    });
  };

  const handleOutChange = (_event, newValue) => {
    setGraphOptions({ ...graphOptions, out: newValue.sort() });
  };

  const handleAlignChange = (_event, newValue) => {
    setGraphOptions({ ...graphOptions, align: newValue });
  };

  if (!analysisData) {
    return <CircularProgress />;
  }

  return (
    <div>
      <div className="dataPageHeader">
        <Grid
          container
          spacing={3}
          sx={{ flexGrow: 1 }}
          justifyContent="space-between"
        >
          <Grid xs={6} sm={4} md={3}>
            <Select
              options={optionsTC}
              multiSelect
              defaultValue={defaultTC}
              onChange={handleTCChange}
              icon={<FaTemperatureHigh />}
              accessibilityLabel="tc"
              label="Thermocouple(s)"
              tooltipText="Select TC(s) used for graph and table data. NOTE: only active TCs with avg. temps above 0 are shown."
              helperText={
                optionsTC.length < 2
                  ? 'Disabled: only one TC'
                  : 'Select one or more TCs'
              }
              renderValuePrefix="TC-"
              disabled={optionsTC.length < 2}
            />
          </Grid>
          <Grid xs={6} sm={4} md={3}>
            <Select
              options={optionsTCAverage}
              defaultValue="Average"
              onChange={handleAvgChange}
              icon={<FaChartLine />}
              accessibilityLabel="avg"
              label="TC Format"
              tooltipText="Select to either average TC temps in graph or to show separate lines for each TC. NOTE: does not affect table data."
              helperText={
                optionsTC.length < 2
                  ? 'Disabled: only one TC'
                  : 'Select a TC graph format'
              }
              renderValuePrefix=""
              disabled={optionsTC.length < 2}
            />
          </Grid>
          <Grid xs={6} sm={4} md={3}>
            <Select
              options={optionsOut}
              multiSelect
              placeholder="Choose…"
              onChange={handleOutChange}
              icon={<GiElectric />}
              accessibilityLabel="out"
              label="Output(s)"
              tooltipText="Select outputs (% power) to display on the graph as separate lines. 100% output usually indicates that the controller is struggling to keep up with the target ramp speed."
              helperText="Select one or more outputs to graph"
              renderValuePrefix="Out"
              disabled={optionsOut.length === 0}
            />
          </Grid>
          <Grid xs={6} sm={4} md={3}>
            <Select
              options={optionsSegments}
              defaultValue={
                optionsSegments.length ? optionsSegments[0].value : 1
              }
              onChange={handleAlignChange}
              icon={<LuAlignStartVertical />}
              accessibilityLabel="align"
              label="Align Segment"
              tooltipText="Arrange target and actual graph lines so that the chosen segment aligns."
              helperText={
                optionsSegments.length < 2
                  ? 'Disabled: only one segment'
                  : 'Choose segment to align start'
              }
              renderValuePrefix="Seg "
              disabled={optionsSegments.length < 2}
            />
          </Grid>
        </Grid>
      </div>
      <div className="graphContainer">
        <LineGraph />
      </div>
    </div>
  );
};

export default DataPage;
