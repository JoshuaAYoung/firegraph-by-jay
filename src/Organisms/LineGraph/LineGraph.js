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
import { useNavigate } from 'react-router-dom';
import { useFGContext } from '../../context/FGContext';
import './LineGraph.css';
import { minutesToHourString } from '../../Utils/dateUtils/dateUtils';

function CustomReferenceLabel(props) {
  return (
    <text
      offset={props.offset}
      x={props.viewBox.x - 10}
      y={200}
      className="verticalSegmentLabel"
      textAnchor="middle"
    >
      Segment {props.value} Start
    </text>
  );
}

function LineGraph({ segmentOffset }) {
  const { analysisData, graphOptions, combinedChartData } = useFGContext();

  const navigate = useNavigate();

  const outputOptionsLength = graphOptions && graphOptions.out.length;

  const tcColorArray = ['#003f5c', '#444e86', '#955196'];
  const outColorArray = ['#dd5182', '#ff6e54', '#ffa600'];

  // useEffect(() => {
  //   console.log('analysisData', analysisData);
  //   if (!analysisData) {
  //     navigate('/');
  //   }
  // }, []);

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

  console.log('graph', graphOptions, outputOptionsLength, segmentOffset);

  return (
    <ResponsiveContainer width="100%" height="100%" marginTop={20}>
      <LineChart
        width={500}
        height={500}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        data={combinedChartData}
      >
        {analysisData.segments.map((segment, index) => (
          <ReferenceLine
            isFront
            key={segment.number + index}
            x={
              segmentOffset < 0
                ? segment.segmentTicks[0].time + Math.abs(segmentOffset)
                : segment.segmentTicks[0].time
            }
            stroke="red"
            label={<CustomReferenceLabel value={segment.number} />}
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
          strokeWidth={3}
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
                strokeWidth={3}
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
                strokeWidth={3}
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
                offset: 2000,
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
                strokeWidth={3}
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
