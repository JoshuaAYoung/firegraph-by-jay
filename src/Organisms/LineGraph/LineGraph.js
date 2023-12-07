import React, { useEffect, useState } from 'react';
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
import { composeTargetChartData } from '../../Utils/csvUtils/csvUtils';

const LineGraph = () => {
  const { analysisData } = useFGContext();
  const [actualChartData, setActualChartData] = useState([]);
  const [targetChartData, setTargetChartData] = useState([]);
  const [combinedChartData, setCombinedChartData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (analysisData) {
      const actualData = analysisData.segments
        .map((segment) => {
          return segment.segmentTicks.concat(segment.hold.holdTicks);
        })
        .flat(1);

      const targetData = composeTargetChartData(analysisData);

      setTargetChartData(composeTargetChartData(analysisData));

      setActualChartData(actualData);

      // Combine the two arrays by index, and combine the object at that index
      // i.e. {[time: 0, temp: 20} ...] + {[time: 0, targetTemp: 25} ...] = {[{time: 0, temp: 20, targetTemp: 25} ...]
      const zip = (a, b) => {
        const largerArray = a.length > b.length ? a : b;
        const smallerArray = a.length < b.length ? a : b;

        return largerArray.map((x, i) => [x, smallerArray[i]]);
      };

      const combinedData = zip(targetData, actualData).map((obj) =>
        Object.assign({}, ...obj)
      );

      setCombinedChartData(combinedData);

      console.log('actualData', actualData);
      console.log('target', composeTargetChartData(analysisData));
      console.log('combined', combinedData);
    }
  }, [analysisData]);

  // useEffect(() => {
  //   console.log('analysisData', analysisData);
  //   if (!analysisData) {
  //     navigate('/');
  //   }
  // }, []);

  const renderCustomAxisTick = (props) => {
    return (
      <text
        x={props.x}
        y={props.y + 15}
        orientation={props.orientation}
        textAnchor={props.textAnchor}
      >
        {props.payload.value}
      </text>
    );
  };

  const CustomReferenceLabel = (props) => {
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
  };

  const tooltipFormatter = (value, name, props) => {
    if (props && (props.dataKey === 'temp' || props.dataKey === 'targetTemp')) {
      return [`${value}°`, `${name} Temp`];
    }
    return `Time : ${value} min.`;
  };

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
        {analysisData.segments.map((segment) => {
          return (
            <ReferenceLine
              isFront
              key={segment.number}
              x={segment.segmentTicks[0].time}
              stroke="red"
              label={<CustomReferenceLabel value={segment.number} />}
              strokeDasharray="6 3"
            />
          );
        })}
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          type="number"
          padding={{ left: 40, right: 40 }}
          label={{
            value: 'Time in Minutes',
            position: 'insideBottom',
            offset: 40,
          }}
          tick={renderCustomAxisTick}
          scale="time"
          interval={59}
        />
        <YAxis
          dataKey="temp"
          type="number"
          padding={{ top: 40 }}
          label={{
            value: 'Temp',
            angle: -90,
            offset: 2000,
          }}
        />
        <Tooltip
          formatter={tooltipFormatter}
          labelFormatter={tooltipFormatter}
        />
        <Legend />
        <Line
          name="Actual"
          type="linear"
          dataKey="temp"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          dot={false}
          strokeWidth={4}
        />
        <Line
          name="Target"
          type="linear"
          dataKey="targetTemp"
          stroke="#82ca9d"
          activeDot={{ r: 4 }}
          dot={false}
          strokeWidth={4}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineGraph;
