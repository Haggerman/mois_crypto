/* eslint-disable */
import { useState, useEffect } from 'react';
import React from 'react';
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
const PortfolioGraph = ({userCryptoGraphData}) => {
const [ data, setData] = useState(userCryptoGraphData);
const [dataTable, setDataTable] = useState(null);
const [width, setWidth] = useState(500);
const [height, setHeight] = useState(300);
useEffect(() => { 
if(userCryptoGraphData){
    var dataTable = [];
    for(let i=0; i < userCryptoGraphData.portfolioStatuses.length; i++){
      const unixTime = userCryptoGraphData.portfolioStatuses[i][1];
      const date = new Date(unixTime*1000);
      const formattedDate = Intl.DateTimeFormat('cz-CZ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
      dataTable.push({time: formattedDate, price:userCryptoGraphData.portfolioStatuses[i][0]})
    }
    setDataTable(dataTable);
}
  },[userCryptoGraphData])


  return (<div width={width} height={height}>  

<Card>
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
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="price"
        dot={false}
        isAnimationActive={false}
      />
    </LineChart>
    </ResponsiveContainer>
    </Card>
    </div> );
};

export default PortfolioGraph;
