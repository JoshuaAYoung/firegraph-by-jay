import React, { useEffect, useState } from 'react';
import { CircularProgress, Grid } from '@mui/joy';
import { FaTemperatureHigh } from 'react-icons/fa';
import { GiElectric } from 'react-icons/gi';
import { FaChartLine } from 'react-icons/fa6';
import { LuAlignStartVertical } from 'react-icons/lu';
import { useFGContext } from '../../context/FGContext';
import {
  analyzeCsv,
  calculateActualRamp,
  composeTargetChartData,
  zipArrayOfObjects,
} from '../../Utils/csvUtils/csvUtils';
import LineGraph from '../../Organisms/LineGraph/LineGraph';
import './DataPage.css';
import Select from '../../Molecules/Select/Select';
import DataContainer from '../../Organisms/DataContainer/DataContainer';

const DataPage = () => {
  // Hook(s)
  const {
    csvParsedArray,
    analysisData,
    setAnalysisData,
    graphOptions,
    setGraphOptions,
    setCombinedChartData,
  } = useFGContext();
  const [optionsTC, setOptionsTC] = useState([]);
  const [optionsOut, setOptionsOut] = useState([]);
  const [optionsSegments, setOptionsSegments] = useState([]);
  const [segmentLookupTable, setSegmentLookupTable] = useState([]);
  const [defaultTC, setDefaultTC] = useState([]);
  const [segmentOffset, setSegmentOffset] = useState(0);

  // Computed Var(s)
  const averageTempKeyArray = ['averageTemp1', 'averageTemp2', 'averageTemp3'];
  const averageOutKeyArray = ['averageOut1', 'averageOut2', 'averageOut3'];
  const optionsTCAverage = [
    { value: 'Average', title: 'Average Temps' },
    { value: 'Separate', title: 'Separate Lines' },
  ];

  // Effect(s)
  // Initial
  useEffect(() => {
    if (csvParsedArray && csvParsedArray.length && !analysisData) {
      // analyze data from csv array
      const analyzedData = analyzeCsv(csvParsedArray);
      setAnalysisData(analyzedData);

      // better than using object(keys)? Mebe
      if (analyzedData && analyzedData.preFireInfo) {
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

        // Options to pass to select for align segment
        const optionsSegmentsArray = [];
        // Lookup table to use to find minute to shift for align segment
        const segmentLookupObject = {};
        analyzedData.segments.forEach((segment) => {
          optionsSegmentsArray.push({
            value: segment.number,
            title: `Segment ${segment.number}`,
            minute: segment.segmentTicks[0].time,
          });
          segmentLookupObject[segment.number] = segment.segmentTicks[0].time;
        });

        setOptionsTC(optionsTCArray);
        setDefaultTC(defaultTCArray);
        setOptionsOut(optionsOutArray);
        setOptionsSegments(optionsSegmentsArray);
        setSegmentLookupTable(segmentLookupObject);
        setGraphOptions({
          tcs: defaultTCArray,
          avg: true,
          align: optionsSegmentsArray[0].value || '1',
          out: [],
        });
      }
    } else {
      // SHOW ERROR MODAL
    }
  }, []);

  useEffect(() => {
    // Set combined chart data (on mount and segment align change)
    if (analysisData) {
      const actualData = analysisData.segments
        .map((segment) => {
          return segment.segmentTicks.concat(segment.hold.holdTicks);
        })
        .flat(1);

      const { targetSegmentLookup, targetDataArrayWithApprox } =
        composeTargetChartData(analysisData);

      // shift for the lines based on difference in time between target and actual at start of segment
      const arrayOffset =
        Number(segmentLookupTable[graphOptions.align]) -
        Number(targetSegmentLookup[graphOptions.align]);

      const combinedData = zipArrayOfObjects(
        targetDataArrayWithApprox,
        actualData,
        graphOptions.align === '1' ? 0 : arrayOffset,
        graphOptions.tcs
      );

      console.log('arrayOffset', arrayOffset);
      setSegmentOffset(arrayOffset);

      setCombinedChartData(combinedData);

      console.log('combined', combinedData);
    }
  }, [analysisData, graphOptions.align, graphOptions.tcs]);

  useEffect(() => {
    // parse averages
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
    // SHOW ERROR MODAL
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
              // accessibilityLabel="avg"
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
                optionsSegments.length ? optionsSegments[0].value : '1'
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
        <LineGraph segmentOffset={segmentOffset} />
      </div>
      <div>
        <DataContainer />
      </div>
    </div>
  );
};

export default DataPage;
