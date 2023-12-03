import { cloneDeep } from "lodash";

export const defaultAnalysisValues = {
  preFireInfo: [],
  programName: '',
  startTime: '',
  totalSegments: '',
  segments: [],
  diagnostics: [],
  postFireInfo: [],
};

const analyzeCsv = (dataArray) => {
  if (dataArray.length) {
    const analysisObj = cloneDeep(defaultAnalysisValues);
    analysisObj.startTime = dataArray[0].time || 'N/A';
    let segmentType = 'start';
    console.log("dataArray[0].time", dataArray[0].time)

    dataArray.forEach((row, index) => {
      switch (row.event) {
        case 'info':
          if (row.name && segmentType === 'start') {
            analysisObj.preFireInfo.push({
              name: row.name,
              value: row.value,
            });
          }
          if (row.name && segmentType !== 'start') {
            analysisObj.postFireInfo.push({
              name: row.name,
              value: row.value,
            });
          }
          break;
        case 'program':
          if (row.name === 'name') {
            analysisObj.programName = row.value;
          }
          if (row.name === 'segments') {
            analysisObj.totalSegments = row.value;
          }
          break;
        case 'start ramp':
          if (row.name === 'segment') {
            segmentType = 'ramp';
            analysisObj.segments.unshift({
              number: row.value,
              startTime: dataArray[index - 1].time,
              actualHalfMinutes: 0,
              startActualTemp: '',
              endActualTemp: '',
              skipped: false,
              hold: {
                targetHoldTime: '',
                actualHalfMinutes: 0,
                targetTemp: '',
                startActualTemp: '',
                endActualTemp: '',
              },
            });
          }
          if (row.name === 'rate') {
            // this works because the array is reversed using unshift
            analysisObj.segments[0] = {
              ...analysisObj.segments[0],
              targetRamp: row.value,
            };
          }
          if (row.name === 'temp') {
            analysisObj.segments[0] = {
              ...analysisObj.segments[0],
              temp: row.value,
            };
          }
          break;
        case 'diagnostics':
          if (row.name) {
            analysisObj.diagnostics.push({
              name: row.name,
              value: row.value,
            });
          }
          break;
        case 'start hold':
          if (row.name === 'hold time') {
            analysisObj.segments[0].hold = {
              ...analysisObj.segments[0].hold,
              targetHoldTime: row.value,
            };
            segmentType = 'hold';
          }
          if (row.name === 'temp') {
            analysisObj.segments[0].hold = {
              ...analysisObj.segments[0].hold,
              targetTemp: row.value,
            };
          }
          break;
        default:
          if (row.t30s && row.t30s !== '0') {
            if (segmentType === 'ramp') {
              analysisObj.segments[0] = {
                ...analysisObj.segments[0],
                actualHalfMinutes:
                  analysisObj.segments[0].actualHalfMinutes + 1,
                startActualTemp:
                  analysisObj.segments[0].startActualTemp ? analysisObj.segments[0].startActualTemp : row['temp2'],
                endActualTemp: row['temp2'],
              };
            }
            if (segmentType === 'hold') {
              analysisObj.segments[0].hold = {
                ...analysisObj.segments[0].hold,
                actualHalfMinutes:
                  analysisObj.segments[0].hold.actualHalfMinutes + 1,
                startActualTemp:
                analysisObj.segments[0].startActualTemp ? analysisObj.segments[0].startActualTemp : row['temp2'],
                endActualTemp: row['temp2'],
              };
            }
          }
      }
    });
    return analysisObj;
  }
};

export const calculateActualRamp = (
  actualHalfMinutes,
  startActualTemp,
  endActualTemp, 
  segmentNumber
) => {
  const hours = (actualHalfMinutes / 2) / 60;
  const degreesRise = Number(endActualTemp) - Number(startActualTemp);
  return {[segmentNumber]: degreesRise / hours};
};

export default analyzeCsv;
