import React, { useMemo } from 'react';
import { Sheet, Table } from '@mui/joy';
import TableRow from './TableRow';
import {
  calculateActualRamp,
  minutesFromRamp,
} from '../../Utils/csvUtils/csvUtils';
import {
  minutesToHourString,
  parseDateString,
} from '../../Utils/dateUtils/dateUtils';
import Tooltip from '../Tooltip/Tooltip';
import { useFGContext } from '../../context/FGContext';

function DataTable() {
  const { analysisData, graphOptions } = useFGContext();
  const tempTooltipText =
    'This value is affected by the user selected TCs at the top of the page.';

  const rowData = useMemo(
    () =>
      analysisData?.segments?.map((segment, index) => {
        let totalStartTCTemp = 0;
        let totalEndTCTemp = 0;
        graphOptions.tcs.forEach((tc) => {
          totalStartTCTemp += Number(segment[`startActualTemp${tc}`]);
          totalEndTCTemp += Number(segment[`endActualTemp${tc}`]);
        });

        const averageStartTemp = Math.round(
          totalStartTCTemp / graphOptions.tcs.length,
        );
        const averageEndTemp = Math.round(
          totalEndTCTemp / graphOptions.tcs.length,
        );

        const actualRamp = calculateActualRamp(
          segment.actualHalfMinutes,
          averageStartTemp,
          averageEndTemp,
        );

        const startTempTarget =
          analysisData.segments[index - 1]?.targetTemp || 0;
        const targetDurationMinutes = minutesFromRamp(
          startTempTarget,
          segment.targetTemp,
          segment.targetRamp,
        );

        const { isoDateWithTime: startTime } = parseDateString(
          segment.startTime,
        );
        const { isoDateWithTime: endTime } = parseDateString(
          analysisData.segments[index + 1]?.startTime || analysisData.endTime,
        );

        return {
          number: segment.number,
          actualRamp: Math.abs(actualRamp),
          targetRamp: segment.targetRamp,
          rampDiff: Math.round(segment.targetRamp - actualRamp),
          targetTemp: segment.targetTemp,
          targetHoldTime: segment.hold?.targetHoldTime,
          actualDuration: minutesToHourString(segment.actualHalfMinutes / 2),
          targetDuration: minutesToHourString(targetDurationMinutes),
          durationDiff: Math.round(
            segment.actualHalfMinutes / 2 - targetDurationMinutes,
          ),
          startTime,
          endTime,
          actualStartTemp: averageStartTemp,
          targetStartTemp: startTempTarget,
          actualEndTemp: averageEndTemp,
          actualHoldTime: minutesToHourString(
            segment.hold.actualHalfMinutes / 2,
          ),
          temp1Average: segment.averageTemp1,
          temp2Average: segment.averageTemp2,
          temp3Average: segment.averageTemp3,
          out1Average: segment.averageOut1,
          out2Average: segment.averageOut2,
          out3Average: segment.averageOut3,
          skipped: segment.skipped,
        };
      }),
    [analysisData, graphOptions.tcs],
  );

  return (
    <Sheet
      variant="soft"
      color="neutral"
      sx={{
        overflow: 'auto',
        borderRadius: 'sm',
        transition: '0.3s',
        '& tr:last-child': {
          '& td:first-child': {
            borderBottomLeftRadius: '8px',
          },
          '& td:last-child': {
            borderBottomRightRadius: '8px',
          },
        },
      }}
    >
      <Table
        hoverRow
        borderAxis="bothBetween"
        aria-label="collapsible table"
        sx={{
          minWidth: 900,
          '& > tbody > tr:nth-child(odd) > td, & > tbody > tr:nth-child(odd) > th[scope="row"]':
            {
              borderBottom: 0,
            },
        }}
      >
        <thead>
          <tr>
            <th
              colSpan={10}
              style={{ paddingLeft: 24, fontWeight: '700', fontSize: 20 }}
            >
              Detailed Segment Data
            </th>
          </tr>
          <tr>
            <th
              rowSpan={2}
              style={{
                maxWidth: '25px',
                borderLeftStyle: 'none',
                textAlign: 'center',
              }}
              aria-label="empty"
            >
              <Tooltip tooltipText="Click a row to see segment details." />
            </th>
            <th rowSpan={2}>Segment</th>
            <th colSpan={3} style={{ textAlign: 'center' }}>
              Ramp Rate (°/hr)
            </th>
            <th rowSpan={2}>
              Temp.{' '}
              <Tooltip
                tooltipText="Target top temp for the segment."
                iconDims={24}
              />
            </th>
            <th rowSpan={2}>Hold Time</th>
            <th colSpan={3} style={{ textAlign: 'center' }}>
              Duration{' '}
              <Tooltip
                tooltipText="Does not include hold duration."
                iconDims={24}
              />
            </th>
          </tr>
          <tr>
            <th>
              Actual <Tooltip tooltipText={tempTooltipText} iconDims={24} />
            </th>
            <th>Target</th>
            <th>
              Diff. <Tooltip tooltipText={tempTooltipText} iconDims={24} />
            </th>
            <th>Actual</th>
            <th>Target</th>
            <th>Diff.</th>
          </tr>
        </thead>
        <tbody>
          {rowData.map((row, index) => (
            <TableRow
              key={`${row.number} - ${index}`}
              row={row}
              tempTooltipText={tempTooltipText}
            />
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}

export default DataTable;
