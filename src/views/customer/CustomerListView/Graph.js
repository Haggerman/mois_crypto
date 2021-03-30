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
const { data, error, isPending} = useFetch("https://api.coingecko.com/api/v3/coins/"+cryptoId+"/market_chart?vs_currency=usd&days=30&interval=daily");
const [dataTable, setDataTable] = useState(null);
const [width, setWidth] = useState(500);
const [height, setHeight] = useState(300);

useEffect(() => { 
if(data){
    var i;
    var dataTable = [];
    for(i=0; i < data.prices.length; i++){
        dataTable.push({time: i, price:data.prices[i][1]})
    }
    console.log(dataTable);
    setDataTable(dataTable);
}
  },[data])


  return (<div width={width} height={height}>  

<ResponsiveContainer width="95%" height={400}>
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
        stroke="#8884d8"
      isAnimationActive={false}
      />
    </LineChart>
    </ResponsiveContainer>
    </div> );
};

export default Graph;
