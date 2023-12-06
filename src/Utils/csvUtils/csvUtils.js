import { cloneDeep } from 'lodash';

export const defaultAnalysisValues = {
  preFireInfo: [],
  programName: '',
  startTime: '',
  endTime: '',
  totalSegments: '',
  segments: [],
  diagnostics: [],
  postFireInfo: [],
  events: [],
};

const analyzeCsv = (dataArray) => {
  if (dataArray.length) {
    const analysisObj = cloneDeep(defaultAnalysisValues);
    analysisObj.startTime = dataArray[0].time || 'N/A';
    let segmentType = 'start';

    dataArray.forEach((row, index) => {
      switch (row.event) {
        case 'info':
          // Info at start of CSV
          if (row.name && segmentType === 'start') {
            analysisObj.preFireInfo.push({
              name: row.name,
              value: row.value,
            });
          }
          // Info at end of CSV
          if (row.name && segmentType !== 'start') {
            analysisObj.postFireInfo.push({
              name: row.name,
              value: row.value,
            });
          }
          // end time set from first info event at end of CSV
          if (!row.name && segmentType !== 'start' && row.time) {
            analysisObj.endTime = row.time;
          }
          break;
        case 'program':
          // Program name
          if (row.name === 'name') {
            analysisObj.programName = row.value;
          }
          // # of segments in firing
          if (row.name === 'segments') {
            analysisObj.totalSegments = row.value;
          }
          break;
        case 'start ramp':
          // Adds the segment object to the array
          // Populates number and startTime (based off of previous array items time)
          if (row.name === 'segment') {
            segmentType = 'ramp';
            analysisObj.segments.unshift({
              number: row.value,
              startTime: dataArray[index - 1].time,
              // start from -1 because time 0 adds a half minute
              actualHalfMinutes: -1,
              startActualTemp: '',
              endActualTemp: '',
              skipped: false,
              segmentTicks: [],
              targetRamp: '',
              targetTemp: '',
              hold: {
                targetHoldTime: '',
                // start from -1 because time 0 adds a half minute
                actualHalfMinutes: -1,
                targetTemp: '',
                startActualTemp: '',
                endActualTemp: '',
                holdTicks: [],
              },
            });
          }
          // Segment target ramp
          if (row.name === 'rate') {
            // this works because the array is reversed using unshift
            analysisObj.segments[0] = {
              ...analysisObj.segments[0],
              targetRamp: row.value,
            };
          }
          // Segment target temp
          if (row.name === 'temp') {
            analysisObj.segments[0] = {
              ...analysisObj.segments[0],
              targetTemp: row.value,
            };
          }
          break;
        case 'diagnostics':
          // Diagnostic info from start of CSV
          if (row.name) {
            analysisObj.diagnostics.push({
              name: row.name,
              value: row.value,
            });
          }
          break;
        case 'start hold':
          // Adds hold info to the "current" ([0]) segment array item
          if (row.name === 'hold time') {
            analysisObj.segments[0].hold = {
              ...analysisObj.segments[0].hold,
              targetHoldTime: row.value,
            };
            // Change the segment type for the t30 values
            segmentType = 'hold';
          }
          // Hold target temp
          if (row.name === 'temp') {
            analysisObj.segments[0].hold = {
              ...analysisObj.segments[0].hold,
              targetTemp: row.value,
            };
          }
          break;
        case 'manual stop firing':
          // Adds an event in the case of a manual stop
          // Events might want to go in the segments array?
          analysisObj.events.push({
            manualStop: `Firing was manually stopped during segment ${analysisObj.segments[0].number}`,
          });
          break;
        case 'skip step':
          // Adds an event in the case of a skip and notes that in the segment
          if (!row.name && row.time) {
            analysisObj.events.push({
              skipStep: `Segment ${analysisObj.segments[0].number} was skippped at ${row.time}`,
            });
            analysisObj.segments[0].skipped = true;
          }
          // Treats a skip as a new segment, which it is
          // Populates number and startTime (based off of previous array items time)
          if (row.name === 'segment') {
            segmentType = 'ramp';
            analysisObj.segments.unshift({
              number: row.value,
              startTime: dataArray[index - 1].time,
              actualHalfMinutes: 0,
              startActualTemp: '',
              endActualTemp: '',
              skipped: false,
              segmentTicks: [],
              hold: {
                targetHoldTime: '',
                actualHalfMinutes: 0,
                targetTemp: '',
                startActualTemp: '',
                endActualTemp: '',
                holdTicks: [],
              },
            });
          }
          // Segment target ramp
          if (row.name === 'rate') {
            // this works because the array is reversed using unshift
            analysisObj.segments[0] = {
              ...analysisObj.segments[0],
              targetRamp: row.value,
            };
          }
          // Segment target temp
          if (row.name === 'temp') {
            analysisObj.segments[0] = {
              ...analysisObj.segments[0],
              targetTemp: row.value,
            };
          }
          break;
        default:
          if (row.t30s) {
            if (segmentType === 'ramp') {
              // Add the start temp and end temp for segment
              analysisObj.segments[0] = {
                ...analysisObj.segments[0],
                actualHalfMinutes:
                  analysisObj.segments[0].actualHalfMinutes + 1,
                startActualTemp: analysisObj.segments[0].startActualTemp
                  ? analysisObj.segments[0].startActualTemp
                  : row.temp2,
                endActualTemp: row.temp2,
              };
              // Keep track of minutes and temp for segment
              if (Number(row.t30s) % 2 === 0) {
                analysisObj.segments[0].segmentTicks.push({
                  time: Number(row.t30s / 2),
                  temp: Number(row.temp2),
                });
              }
            }
            if (segmentType === 'hold') {
              // Add the start temp and end temp for holds
              analysisObj.segments[0].hold = {
                ...analysisObj.segments[0].hold,
                actualHalfMinutes:
                  analysisObj.segments[0].hold.actualHalfMinutes + 1,
                startActualTemp: analysisObj.segments[0].hold.startActualTemp
                  ? analysisObj.segments[0].hold.startActualTemp
                  : row.temp2,
                endActualTemp: row.temp2,
              };
              // Keep track of minutes and temp for hold
              if (Number(row.t30s) % 2 === 0) {
                analysisObj.segments[0].hold.holdTicks.push({
                  time: Number(row.t30s / 2),
                  temp: Number(row.temp2),
                });
              }
            }
          }
      }
    });
    analysisObj.segments.reverse();
    return analysisObj;
  }
  return undefined;
};

export const calculateActualRamp = (
  actualHalfMinutes,
  startActualTemp,
  endActualTemp,
  segmentNumber
) => {
  const hours = actualHalfMinutes / 2 / 60;
  const degreesRise = Number(endActualTemp) - Number(startActualTemp);
  // Note: toFixed converts to string
  const degPerHour = (degreesRise / hours).toFixed(1);
  return { [segmentNumber]: degPerHour };
};

export const minutesFromRamp = (targetStartTemp, targetEndTemp, targetRamp) => {
  const targetRise = Math.abs(Number(targetEndTemp) - Number(targetStartTemp));
  return Math.round((targetRise / targetRamp) * 60);
};

export const composeTargetChartData = (analysisData) => {
  const targetData = [{ time: 0, targetTemp: 0 }];
  let minuteCounter = 0;

  // graph points in the array for segment
  analysisData.segments.forEach((segment, index) => {
    const startTemp = analysisData.segments[index - 1]
      ? analysisData.segments[index - 1].targetTemp
      : 0;
    const segmentMinutes = minutesFromRamp(
      startTemp,
      segment.targetTemp,
      segment.targetRamp
    );
    minuteCounter += segmentMinutes;
    targetData.push({
      time: minuteCounter,
      targetTemp: Number(segment.targetTemp),
    });

    // graph points in the array for hold
    if (segment.hold.targetHoldTime && segment.hold.targetHoldTime !== '0h0m') {
      const timeArray = segment.hold.targetHoldTime.split('h');
      const totalHoldMinutes =
        parseInt(timeArray[0], 10) * 60 + parseInt(timeArray[1], 10);
      minuteCounter += totalHoldMinutes;

      targetData.push({
        time: minuteCounter,
        targetTemp: Number(segment.targetTemp),
      });
    }
  });
  const targetDataArrayWithApprox = [];
  const targetDataLength = targetData.length;

  // fill every minute in the array with approximate temps
  for (let i = 0; i < targetDataLength - 1; i += 1) {
    let tempCounter = targetData[i].targetTemp;
    const tempRise =
      (targetData[i].targetTemp - targetData[i + 1].targetTemp) /
      (targetData[i].time - targetData[i + 1].time);
    for (let j = targetData[i].time; j < targetData[i + 1].time; j += 1) {
      // use real temp if we're hitting that target node point exactly
      if (targetData[i].time === j) {
        targetDataArrayWithApprox.push({
          time: targetData[i].time,
          targetTemp: targetData[i].targetTemp,
        });
        // otherwise use the approximate temp
      } else {
        tempCounter += tempRise;
        targetDataArrayWithApprox.push({
          time: j,
          targetTemp: Math.round(tempCounter),
        });
      }
    }
  }

  return targetDataArrayWithApprox;
};

export default analyzeCsv;
