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
import { 
  Card,
  Box,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';
const PortfolioGraph = ({ userCryptoGraphData }) => {
  const [data, setData] = useState(userCryptoGraphData);
  const [dataTable, setDataTable] = useState(null);
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(300);
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload) {
      return (
        <Card>
          <div>
            <p>
              Date: {moment(payload[0].payload.time).format('DD-MM-YY  HH:mm')}
            </p>
            <p>Price: ${(payload[0].value).toLocaleString()}</p>
          </div>
        </Card>
      );
    }
    return null;
  };

  useEffect(() => {
    if (userCryptoGraphData) {
      var dataTable = [];
      for (let i = 0; i < userCryptoGraphData.portfolioStatuses.length; i++) {
        const unixTime = userCryptoGraphData.portfolioStatuses[i][1];
        const date = new Date(unixTime * 1000);

        dataTable.push({ time: date, price:userCryptoGraphData.portfolioStatuses[i][0] });
      }
      setDataTable(dataTable);
    }
  }, [userCryptoGraphData]);

  return (
    <div width={width} height={height}>
      <Card>
        <CardContent>
          <Grid
            container
            justify="space-between"
            spacing={3}
          >
            <Grid item>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="h6"
              >
                PORTFOLIO GRAPH
              </Typography>
            </Grid>
          </Grid>
        <ResponsiveContainer width="95%" height={500}>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioGraph;
