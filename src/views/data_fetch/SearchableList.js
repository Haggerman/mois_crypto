/* eslint-disable */
import React from 'react';
import { MDBDataTable } from 'mdbreact';
import { useState, useEffect } from 'react';
import useFetch from './useFetch'

const SearchableList = () => {
const { data, error, isPending} = useFetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=&page=1&sparkline=false&price_change_percentage=24h');
const [dataTable, setData] = useState({});
useEffect(() => {
  if(data){
  const dataTable = {
    columns: [
      {
        label: 'Name',
        field: 'name',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Symbol',
        field: 'symbol',
        sort: 'asc',
        width: 270
      },
      {
        label: 'Price change 24h',
        field: 'price_change_24h',
        sort: 'asc',
        width: 200
      },
      {
        label: 'ATH',
        field: 'ath',
        sort: 'asc',
        width: 100
      },
      {
        label: 'Price',
        field: 'current_price',
        sort: 'asc',
        width: 150
      },
    ],
    rows: data
  }
  setData(dataTable)
  console.log(dataTable)
}
  },[data])
  
  return (<div>
    {dataTable &&
    <MDBDataTable
      striped
      bordered
      small
      data={dataTable}
    /> }
    </div>
  );
}

export default SearchableList;