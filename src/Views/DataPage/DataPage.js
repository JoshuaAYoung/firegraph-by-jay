import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/joy';
import { FaTemperatureHigh } from 'react-icons/fa';
import { GiElectric } from 'react-icons/gi';
import { FaChartLine } from 'react-icons/fa6';
import { LuAlignStartVertical } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { useFGContext } from '../../context/FGContext';
import LoadingIndicator from '../../Atoms/LoadingIndicator/LoadingIndicator';
import {
  analyzeCsv,
  composeTargetChartData,
  zipArrayOfObjects,
} from '../../Utils/csvUtils/csvUtils';
import LineGraph from '../../Organisms/LineGraph/LineGraph';
import './DataPage.css';
import Select from '../../Atoms/Select/Select';
import DataContainer from '../../Organisms/DataContainer/DataContainer';
import Modal from '../../Atoms/Modal/Modal';

function DataPage() {
  // Hook(s)
  const {
    csvParsedArray,
    analysisData,
    setAnalysisData,
    graphOptions,
    setGraphOptions,
    setCombinedChartData,
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
    globalErrorMessage,
    setGlobalErrorMessage,
    setDefaultTC,
  } = useFGContext();

  const [segmentOffset, setSegmentOffset] = useState(0);
  const [hasError, setHasError] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Computed Var(s)
  const averageTempKeyArray = ['averageTemp1', 'averageTemp2', 'averageTemp3'];
  const averageOutKeyArray = ['averageOut1', 'averageOut2', 'averageOut3'];
  const optionsTCAverage = [
    { value: 'Average', title: 'Average Temps' },
    { value: 'Separate', title: 'Separate Lines' },
  ];

  // Returning to the page, we want to replace the value without actually controlling the Select.
  // If file doesn't have seg 1, and we haven't selected a value, display the first seg in the array. Otherwise 1.
  const defaultAlignValue =
    graphOptions.align !== '1'
      ? graphOptions.align
      : optionsSegments[0]?.value || '1';

  // Effect(s)
  // Initial
  useEffect(() => {
    if (!csvParsedArray.length) {
      navigate('/');
      return;
    }

    if (csvParsedArray && csvParsedArray.length && !analysisData) {
      setIsLoading(true);
      // analyze data from csv array
      const analyzeDataAsync = async () => {
        try {
          const analyzedData = analyzeCsv(csvParsedArray);
          setAnalysisData(analyzedData);

          // preFireInfo is in the template, so this is kind of a loose check that analyzeCsv actually did something
          if (analyzedData && analyzedData.preFireInfo) {
            // If we upload a single file that's second in multi-file series, this condition will be true
            if (analyzedData.segments[0].segmentTicks[0].time !== 0) {
              setGlobalErrorMessage(
                'Looks like you uploaded the second file of a multi-file log. When the Genesis fires for more than 24 hours, it creates a second log file, and they must be uploaded in order. From the menu, you can choose to view the raw CSV file to check it for issues.',
              );
            }

            // set the thermocouple and output select options on first render
            const optionsTCArray = [];
            const defaultTCArray = [];
            const optionsOutArray = [];
            const averageTempArray = [];
            let averageTCSum = 0;

            averageTempKeyArray.forEach((key, index) => {
              if (key.includes('Temp') && analyzedData[key] !== 0) {
                optionsTCArray.push({
                  value: index + 1,
                  title: `TC${index + 1} (${analyzedData[key]}° avg.)`,
                });
                defaultTCArray.push(index + 1);
                // for determining if a tc is way off to warn user
                averageTempArray.push(analyzedData[key]);
                averageTCSum += analyzedData[key];
              }
            });

            averageTempArray.forEach((avgTemp) => {
              const averageTCTemp = averageTCSum / averageTempArray.length;
              if (Math.abs(averageTCTemp - avgTemp) > 50) {
                setGlobalErrorMessage(
                  'One or more thermocouples appear to be off by 50° or more from the average. This usually indicates an issue with one of your thermocouples. Consult the graph or table below, or use the CSV Viewer to diagnose.',
                );
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
              segmentLookupObject[segment.number] =
                segment.segmentTicks[0].time;
            });

            setOptionsTC(optionsTCArray);
            setDefaultTC(defaultTCArray);
            setOptionsOut(optionsOutArray);
            setOptionsSegments(optionsSegmentsArray);
            setSegmentLookupTable(segmentLookupObject);
            setGraphOptions({
              tcs: defaultTCArray,
              avg: false,
              align: optionsSegmentsArray[0]?.value || '1',
              out: [1, 2, 3],
            });
          } else {
            throw new Error('Data Error, analyze CSV data.');
          }
        } catch (error) {
          ReactGA.event({
            category: 'Errors',
            action: error || 'Error analyzing data',
            label: 'DataPage',
          });
          setHasError(true);
        }
      };

      analyzeDataAsync();
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Set combined chart data (on mount and segment align change)
    if (analysisData) {
      const actualData = analysisData.segments
        .map((segment) => segment.segmentTicks.concat(segment.hold.holdTicks))
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
        graphOptions.align === optionsSegments[0].value ? 0 : arrayOffset,
        graphOptions.tcs,
      );

      setSegmentOffset(arrayOffset);

      setCombinedChartData(combinedData);
      setTargetDuration(targetDataArrayWithApprox.length - 1);
    }
  }, [analysisData, graphOptions.align, graphOptions.tcs]);

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

  const resetErrors = () => {
    setGlobalErrorMessage('');
    setHasError(false);
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  console.log('graphOptions.out', graphOptions.out);

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
              defaultValue={
                graphOptions.tcs.length ? graphOptions.tcs : defaultTC
              }
              onChange={handleTCChange}
              icon={<FaTemperatureHigh />}
              accessibilityLabel="tc"
              label="Thermocouple(s)"
              tooltipText="Select TC(s) used for the graph and the data table. NOTE: only active TCs with avg. temps above 0° are shown."
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
              defaultValue={graphOptions.avg === false ? 'Separate' : 'Average'}
              onChange={handleAvgChange}
              icon={<FaChartLine />}
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
              defaultValue={
                graphOptions.out.length ? graphOptions.out : undefined
              }
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
              defaultValue={defaultAlignValue}
              onChange={handleAlignChange}
              icon={<LuAlignStartVertical />}
              accessibilityLabel="align"
              label="Align Segment"
              tooltipText="Arrange target and actual graph lines so that the start of the chosen segment aligns."
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
      <div className="dataContainer">
        <DataContainer />
      </div>
      <Modal
        open={hasError || !!globalErrorMessage}
        onClose={resetErrors}
        title="Warning"
        message={
          globalErrorMessage ||
          'There was an issue analyzing the CSV you uploaded. Return home and try uploading again, or check your csv file for issues.'
        }
      />
    </div>
  );
}

export default DataPage;
