/* eslint-disable */
import React from 'react';
import { MDBDataTable } from 'mdbreact';
import { useState, useEffect } from 'react';
import useFetch from './useFetch'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const SearchableList = () => {
const { data, error, isPending} = useFetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=&page=1&sparkline=false&price_change_percentage=24h');
const [dataTable, setData] = useState({});
const [selectedCrypto, setSelectedCrypto] = React.useState('');
const [cryptoSymbols, setCryptoSymbols] = useState({});
const handleChange = (event) => {
  setSelectedCrypto(event.target.value);
};

var cryptoSymbolsArray = [];
useEffect(() => {
  if(data){
    data.forEach(element => {
      cryptoSymbolsArray.push(element.symbol);
    });
    data.forEach(element => {
      element.image = <img src={element.image} width="30"></img>
    });
    setCryptoSymbols(cryptoSymbolsArray);
  const dataTable = {
    columns: [
      {
        label: 'Icon',
        field: 'image',
        sort: 'asc',
        width: 150
      },
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
        label: 'Percent change 24h',
        field: 'price_change_percentage_24h',
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
    <FormControl>
        <InputLabel id="demo-simple-select-label">Vyber kryptoměnu</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedCrypto}
          onChange={handleChange}
        >
          {/*cryptoSymbols.map((symbol, index) => <MenuItem key={index} value={symbol}>{symbol}</MenuItem>)*/}
        </Select>
      </FormControl>
    </div>
  );
}

export default SearchableList;