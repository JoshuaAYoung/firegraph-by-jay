import { cloneDeep } from 'lodash';
import { parseDateString } from '../dateUtils/dateUtils';

export const analysisValuesTemplate = {
  preFireInfo: [],
  programName: '',
  startTime: '',
  endTime: '',
  totalSegments: '',
  segments: [],
  diagnostics: [],
  postFireInfo: [],
  events: [],
  averageTemp1: 0,
  averageTemp2: 0,
  averageTemp3: 0,
  averageOut1: 0,
  averageOut2: 0,
  averageOut3: 0,
  actualMinuteTicks: 0,
};

export const segmentValuesTemplate = {
  number: '',
  startTime: '',
  actualHalfMinutes: '',
  startActualTemp1: '',
  startActualTemp2: '',
  startActualTemp3: '',
  endActualTemp1: '',
  endActualTemp2: '',
  endActualTemp3: '',
  skipped: false,
  segmentTicks: [],
  targetRamp: '',
  targetTemp: '',
  averageTemp1: 0,
  averageTemp2: 0,
  averageTemp3: 0,
  averageOut1: 0,
  averageOut2: 0,
  averageOut3: 0,
  hold: {
    targetHoldTime: '',
    actualHalfMinutes: 0,
    targetTemp: '',
    startActualTemp1: '',
    startActualTemp2: '',
    startActualTemp3: '',
    endActualTemp1: '',
    endActualTemp2: '',
    endActualTemp3: '',
    holdTicks: [],
  },
};

export const analyzeCsv = (dataArray) => {
  if (dataArray.length) {
    const analysisObj = cloneDeep(analysisValuesTemplate);
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
            analysisObj.segments.unshift({
              ...cloneDeep(segmentValuesTemplate),
              number: row.value,
              startTime: dataArray[index - 1].time,
              // start from -1 because time 0 adds a half minute
              actualHalfMinutes: segmentType === 'start' ? -1 : 0,
            });
          }
          segmentType = 'ramp';
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
            name: 'Manual Stop',
            value: `During segment ${analysisObj.segments[0].number}`,
          });
          break;
        case 'skip step':
          // Adds an event in the case of a skip and notes that in the segment
          if (!row.name && row.time) {
            const { isoDateWithTime } = parseDateString(row.time);
            analysisObj.events.push({
              name: 'Segment Skip',
              value: `Segment ${analysisObj.segments[0].number} at ${isoDateWithTime}`,
            });
            analysisObj.segments[0].skipped = true;
          }
          // Treats a skip as a new segment, which it is
          // Populates number and startTime (based off of previous array items time)
          if (row.name === 'segment') {
            segmentType = 'ramp';
            analysisObj.segments.unshift({
              ...cloneDeep(segmentValuesTemplate),
              number: row.value,
              startTime: dataArray[index - 1].time,
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
              // Add the start temps and end temps for segment
              analysisObj.segments[0] = {
                ...analysisObj.segments[0],
                actualHalfMinutes:
                  analysisObj.segments[0].actualHalfMinutes + 1,
                startActualTemp1: analysisObj.segments[0].startActualTemp1
                  ? analysisObj.segments[0].startActualTemp1
                  : row.temp1 || null,
                startActualTemp2: analysisObj.segments[0].startActualTemp2
                  ? analysisObj.segments[0].startActualTemp2
                  : row.temp2 || null,
                startActualTemp3: analysisObj.segments[0].startActualTemp3
                  ? analysisObj.segments[0].startActualTemp3
                  : row.temp3 || null,
                endActualTemp1: row.temp1 || null,
                endActualTemp2: row.temp2 || null,
                endActualTemp3: row.temp3 || null,
              };
              // Keep track of minutes, temp and output for segment (ticks, starting with 0)
              if (Number(row.t30s) % 2 === 0) {
                analysisObj.segments[0].segmentTicks.push({
                  time: Number(row.t30s / 2),
                  temp1: row.temp1 ? Number(row.temp1) : null,
                  temp2: row.temp2 ? Number(row.temp2) : null,
                  temp3: row.temp3 ? Number(row.temp3) : null,
                  out1: row.out1 ? Number(row.out1) : null,
                  out2: row.out2 ? Number(row.out2) : null,
                  out3: row.out3 ? Number(row.out3) : null,
                });
              }
            }
            if (segmentType === 'hold') {
              // Add the start temps and end temps for holds
              analysisObj.segments[0].hold = {
                ...analysisObj.segments[0].hold,
                actualHalfMinutes:
                  analysisObj.segments[0].hold.actualHalfMinutes + 1,
                startActualTemp1: analysisObj.segments[0].hold.startActualTemp1
                  ? analysisObj.segments[0].hold.startActualTemp1
                  : row.temp1 || null,
                startActualTemp2: analysisObj.segments[0].hold.startActualTemp2
                  ? analysisObj.segments[0].hold.startActualTemp2
                  : row.temp2 || null,
                startActualTemp3: analysisObj.segments[0].hold.startActualTemp3
                  ? analysisObj.segments[0].hold.startActualTemp3
                  : row.temp3 || null,
                endActualTemp1: row.temp1 || null,
                endActualTemp2: row.temp2 || null,
                endActualTemp3: row.temp3 || null,
              };
              // Keep track of minutes, temp and output for hold (ticks)
              if (Number(row.t30s) % 2 === 0) {
                analysisObj.segments[0].hold.holdTicks.push({
                  time: Number(row.t30s / 2),
                  temp1: row.temp1 ? Number(row.temp1) : null,
                  temp2: row.temp2 ? Number(row.temp2) : null,
                  temp3: row.temp3 ? Number(row.temp3) : null,
                  out1: row.out1 ? Number(row.out1) : null,
                  out2: row.out2 ? Number(row.out2) : null,
                  out3: row.out3 ? Number(row.out3) : null,
                });
              }
            }
          }
      }
    });

    // Track average temps and outputs for entire firing
    let temp1TotalSum = 0;
    let temp2TotalSum = 0;
    let temp3TotalSum = 0;
    let out1TotalSum = 0;
    let out2TotalSum = 0;
    let out3TotalSum = 0;
    let totalMinuteCount = 0;

    // Calculate average temps and outputs for each segment
    analysisObj.segments.forEach((segment, index) => {
      let temp1SegSum = 0;
      let temp2SegSum = 0;
      let temp3SegSum = 0;
      let out1SegSum = 0;
      let out2SegSum = 0;
      let out3SegSum = 0;
      const minuteCount =
        segment.segmentTicks.length + segment.hold.holdTicks.length;

      segment.segmentTicks.forEach((segmentTick) => {
        temp1SegSum += segmentTick.temp1;
        temp2SegSum += segmentTick.temp2;
        temp3SegSum += segmentTick.temp3;
        out1SegSum += segmentTick.out1;
        out2SegSum += segmentTick.out2;
        out3SegSum += segmentTick.out3;
      });

      segment.hold.holdTicks.forEach((holdTick) => {
        temp1SegSum += holdTick.temp1;
        temp2SegSum += holdTick.temp2;
        temp3SegSum += holdTick.temp3;
        out1SegSum += holdTick.out1;
        out2SegSum += holdTick.out2;
        out3SegSum += holdTick.out3;
      });

      temp1TotalSum += temp1SegSum;
      temp2TotalSum += temp2SegSum;
      temp3TotalSum += temp3SegSum;
      out1TotalSum += out1SegSum;
      out2TotalSum += out2SegSum;
      out3TotalSum += out3SegSum;
      totalMinuteCount += minuteCount;

      analysisObj.segments[index].averageTemp1 = Math.round(
        temp1SegSum / minuteCount,
      );
      analysisObj.segments[index].averageTemp2 = Math.round(
        temp2SegSum / minuteCount,
      );
      analysisObj.segments[index].averageTemp3 = Math.round(
        temp3SegSum / minuteCount,
      );
      analysisObj.segments[index].averageOut1 = Math.round(
        out1SegSum / minuteCount,
      );
      analysisObj.segments[index].averageOut2 = Math.round(
        out2SegSum / minuteCount,
      );
      analysisObj.segments[index].averageOut3 = Math.round(
        out3SegSum / minuteCount,
      );
    });

    analysisObj.averageTemp1 = Math.round(temp1TotalSum / totalMinuteCount);
    analysisObj.averageTemp2 = Math.round(temp2TotalSum / totalMinuteCount);
    analysisObj.averageTemp3 = Math.round(temp3TotalSum / totalMinuteCount);
    analysisObj.averageOut1 = Math.round(out1TotalSum / totalMinuteCount);
    analysisObj.averageOut2 = Math.round(out2TotalSum / totalMinuteCount);
    analysisObj.averageOut3 = Math.round(out3TotalSum / totalMinuteCount);
    analysisObj.actualMinuteTicks = totalMinuteCount - 1; // don't count minute at tick 0

    analysisObj.segments.reverse();

    return analysisObj;
  }
  return undefined;
};

export const calculateActualRamp = (
  actualHalfMinutes,
  startActualTemp,
  endActualTemp,
) => {
  const hours = actualHalfMinutes / 2 / 60;
  const degreesRise = Number(endActualTemp) - Number(startActualTemp);
  // Note: toFixed converts to string
  const degPerHour = Math.round(degreesRise / hours);
  return degPerHour;
};

export const minutesFromRamp = (targetStartTemp, targetEndTemp, targetRamp) => {
  const targetRise = Math.abs(Number(targetEndTemp) - Number(targetStartTemp));
  return Math.round((targetRise / targetRamp) * 60);
};

export const composeTargetChartData = (analysisData) => {
  const targetData = [{ time: 0, targetTemp: 0 }];
  const targetSegmentLookup = {};
  let minuteCounter = 0;

  // graph points in the array for segment
  analysisData.segments.forEach((segment, index) => {
    const startTemp = analysisData.segments[index - 1]?.targetTemp || 0;
    const segmentMinutes = minutesFromRamp(
      startTemp,
      segment.targetTemp,
      segment.targetRamp,
    );

    targetSegmentLookup[segment.number] = minuteCounter;

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

  return { targetSegmentLookup, targetDataArrayWithApprox };
};

const zip = (a, b) => {
  const largerArray = a.length > b.length ? a : b;
  const smallerArray = a.length < b.length ? a : b;

  return largerArray.map((x, i) => {
    // setting the time on each of the array items here for segment align
    const xClone = { ...x, time: i };
    const smallerClone = { ...smallerArray[i], time: i };

    return [xClone, smallerClone];
  });
};

export const zipArrayOfObjects = (
  targetArray,
  actualArray,
  arrayOffset,
  selectedTCs,
) => {
  // Combine the two arrays by index, and combine the object at that index
  // i.e. {[time: 0, temp1: 20} ...] + {[time: 0, targetTemp: 25} ...] = {[{time: 0, temp1: 20, targetTemp: 25} ...]
  const emptyOffsetArray = arrayOffset ? new Array(Math.abs(arrayOffset)) : [];

  // segment align offset
  if (arrayOffset < 0) {
    actualArray.unshift(...emptyOffsetArray);
  } else if (arrayOffset > 0) {
    targetArray.unshift(...emptyOffsetArray);
  }

  return zip(targetArray, actualArray).map((obj) => {
    // zip creates an array of the two objects, this combines those two into one obj
    const combinedObject = Object.assign({}, ...obj);

    // average the selected TCs and add a new property "avgTemp"
    let avgTempCount = 0;
    selectedTCs.forEach((tcNumber) => {
      avgTempCount += Number(combinedObject[`temp${tcNumber}`]);
    });

    return {
      ...combinedObject,
      avgTemp: Math.round(avgTempCount / selectedTCs.length),
    };
  });
};
