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
import useFetch from './useFetch';
const Graph = ({cryptoId}) => {
const { data, error, isPending} = useFetch("https://cryptfolio.azurewebsites.net/api/HistoryPrice/"+cryptoId);
const [dataTable, setDataTable] = useState(null);
const [width, setWidth] = useState(500);
const [height, setHeight] = useState(300);

useEffect(() => { 
if(data){
    var i;
    var dataTable = [];
    for(i=0; i < data.prices.length; i++){
      const unixTime = data.prices[i][1];
const date = new Date(unixTime*1000);
const formattedDate = Intl.DateTimeFormat('cz-CZ', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
}).format(date)
console.log(date.toLocaleDateString("cz-CZ"));
        dataTable.push({time: formattedDate, price:data.prices[i][0]})
    }
    setDataTable(dataTable);
}
  },[data])


  return (<div width={width} height={height}>  

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
    </div> );
};

export default Graph;
