import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { useFGContext } from '../../context/FGContext';
import './LineGraph.css';
import { minutesToHourString } from '../../Utils/dateUtils/dateUtils';
import useWindowDimensions from '../../Utils/useWindowDimensions/useWindowDimensions';

function CustomReferenceLabel(props) {
  return (
    <text
      offset={props.offset}
      x={props.viewBox.x - 10}
      y={props.viewBox.height / 3}
      className="verticalSegmentLabel"
      textAnchor="middle"
    >
      {props.isMobile ? `Seg. ${props.value}` : `Segment ${props.value} Start`}
    </text>
  );
}

function LineGraph({ segmentOffset }) {
  const { analysisData, graphOptions, combinedChartData } = useFGContext();
  const { width, height } = useWindowDimensions();
  const isMobile = width < 600;
  const isLargeDesktop = width > 1200;

  const outputOptionsLength = graphOptions && graphOptions.out.length;

  const tcColorArray = ['#003f5c', '#444e86', '#955196'];
  const outColorArray = ['#dd5182', '#ff6e54', '#ffa600'];

  const renderCustomAxisTick = (props) => (
    <text
      x={props.x}
      y={props.y + 15}
      orientation={props.orientation}
      textAnchor={props.textAnchor}
    >
      {props.payload.value / 60}
    </text>
  );

  const tooltipFormatter = (value, name, props) => {
    if (props && props.dataKey === 'targetTemp') {
      return [`${value}°`, `${name} Temp`];
    }
    if (props && props.dataKey.toLowerCase().includes('temp')) {
      return [`${value}°`, `${name} Temp${graphOptions.avg ? ' (avg.)' : ''}`];
    }
    if (props && props.dataKey.toLowerCase().includes('out')) {
      return [`${value}%`, `${name}`];
    }
    return `Time : ${minutesToHourString(value)} hours`;
  };

  const getAspectRatio = () => {
    if (isMobile) {
      return 1.5;
    }
    if (isLargeDesktop) {
      return (width / height) * 1.3;
    }
    return 1.8;
  };

  return (
    <ResponsiveContainer
      width="100%"
      aspect={getAspectRatio()}
      marginTop={20}
      className="lineGraphContainer"
    >
      <LineChart
        margin={
          !isMobile
            ? {
                top: 5,
                right: outputOptionsLength !== 0 ? 8 : 24,
                left: 8,
                bottom: 5,
              }
            : {
                top: 5,
                right: outputOptionsLength !== 0 ? -8 : 16,
                left: -8,
                bottom: 5,
              }
        }
        data={combinedChartData}
        className="lineChart"
      >
        {analysisData.segments.map((segment, index) => (
          <ReferenceLine
            isFront
            key={segment.number + index}
            x={
              segmentOffset < 0
                ? segment.segmentTicks[0].index + Math.abs(segmentOffset)
                : segment.segmentTicks[0].index
            }
            stroke="red"
            label={
              <CustomReferenceLabel
                value={segment.number}
                isMobile={isMobile}
              />
            }
            strokeDasharray="6 3"
            yAxisId="left"
          />
        ))}
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          type="number"
          padding={{ left: 40, right: 40 }}
          label={{
            value: 'Time in Hours',
            position: 'insideBottom',
            offset: 40,
          }}
          tick={renderCustomAxisTick}
          scale="time"
          interval={59}
        />
        <YAxis
          type="number"
          padding={{ top: 40 }}
          label={{
            value: 'Temp',
            angle: -90,
            position: 'left',
            offset: -75,
          }}
          yAxisId="left"
        />
        <Tooltip
          formatter={tooltipFormatter}
          labelFormatter={tooltipFormatter}
        />
        <Legend />
        <Line
          name="Target"
          type="linear"
          dataKey="targetTemp"
          stroke="#57B8FF"
          // stroke="#de663e"
          // stroke="#deaa30"
          // stroke="#D47014"
          activeDot={{ r: 4 }}
          dot={false}
          strokeWidth={!isMobile ? 3 : 2}
          connectNulls
          yAxisId="left"
          isAnimationActive={false}
        />
        {!graphOptions.avg
          ? graphOptions.tcs.map((tcNumber, index) => (
              <Line
                key={`tc${tcNumber} - ${index}`}
                name={`Actual TC${tcNumber}`}
                type="linear"
                dataKey={`temp${tcNumber}`}
                // stroke="#0b84a5"
                stroke={tcColorArray[tcNumber - 1]}
                activeDot={{ r: 8 }}
                dot={false}
                strokeWidth={!isMobile ? 3 : 2}
                yAxisId="left"
                animationDuration={3000}
              />
            ))
          : graphOptions.tcs.length && (
              <Line
                name="Actual"
                type="linear"
                dataKey="avgTemp"
                stroke={tcColorArray[2]}
                activeDot={{ r: 8 }}
                dot={false}
                strokeWidth={!isMobile ? 3 : 2}
                yAxisId="left"
                animationDuration={3000}
              />
            )}
        {outputOptionsLength !== 0 && (
          <>
            <YAxis
              type="number"
              padding={{ top: 40 }}
              label={{
                value: 'Output %',
                angle: -90,
                position: 'right',
                offset: -75,
              }}
              yAxisId="right"
              orientation="right"
              scale="linear"
              domain={[0, 100]}
            />
            {graphOptions.out.map((outputNumber, index) => (
              <Line
                key={`out${outputNumber} - ${index}`}
                name={`Output ${outputNumber}`}
                type="linear"
                dataKey={`out${outputNumber}`}
                // stroke="#0b84a5"
                stroke={outColorArray[outputNumber - 1]}
                activeDot={{ r: 8 }}
                dot={false}
                strokeWidth={!isMobile ? 3 : 2}
                yAxisId="right"
                isAnimationActive={false}
              />
            ))}
          </>
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default LineGraph;
