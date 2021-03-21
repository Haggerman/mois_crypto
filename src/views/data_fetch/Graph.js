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
  Legend
} from 'recharts';
import useFetch from './useFetch';
const Graph = ({cryptoId}) => {
const { data, error, isPending} = useFetch("https://api.coingecko.com/api/v3/coins/"+cryptoId+"/market_chart?vs_currency=usd&days=30&interval=daily");
const [dataTable, setDataTable] = useState(null);


useEffect(() => { 
if(data){
    var i;
    var dataTable = [];
    for(i=0; i < data.prices.length; i++){
        dataTable.push({time: i, value:data.prices[i][1]})
    }
    console.log(dataTable);
    setDataTable(dataTable);
}
  },[data])


  return (<div>
     {isPending &&<div> Loading....</div> } 
     {data &&
    <LineChart
      width={500}
      height={300}
      data={dataTable}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      />
    </LineChart>
}
    </div> );
};

export default Graph;
