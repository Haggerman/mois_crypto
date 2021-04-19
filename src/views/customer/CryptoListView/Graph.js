/* eslint-disable */
import { useState, useEffect } from 'react';
import React from 'react';
import moment from 'moment';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Card } from '@material-ui/core';
import useFetch from './useFetch';

const Graph = ({ cryptoId }) => {
  const { data, error, isPending } = useFetch(
    'https://cryptfolio.azurewebsites.net/api/HistoryPrice/' + cryptoId
  );
  const [dataTable, setDataTable] = useState(null);
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(300);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <Card>
          <div>
            <p>
              Date: {moment(payload[0].payload.time).format('DD-MM-YY  HH:mm')}
            </p>
            <p>Price: ${payload[0].value}</p>
          </div>
        </Card>
      );
    }
    return null;
  };

  useEffect(() => {
    if (data) {
      var i;
      var dataTable = [];
      for (i = 0; i < data.prices.length; i++) {
        const unixTime = data.prices[i][1];
        const date = new Date(unixTime * 1000);

        dataTable.push({ time: date, price: data.prices[i][0] });
      }
      setDataTable(dataTable);
    }
  }, [data]);

  return (
    <div width={width} height={height}>
      <ResponsiveContainer width="95%" height={300}>
        <LineChart
          width={width}
          height={height}
          data={dataTable}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="6 6" />
          <XAxis
            dataKey="time"
            name="Time"
            tickFormatter={unixTime => moment(unixTime).format('DD-MM-YY')}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="price"
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph;
