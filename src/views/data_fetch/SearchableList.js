/* eslint-disable */
import React from 'react';
import { MDBDataTable } from 'mdbreact';
import { useState, useEffect } from 'react';
import useFetch from './useFetch'
import UserCryptosList from './userCryptosList';
import CryptoModalWindow from './CryptoModalWindow';

const SearchableList = () => { 
const { data, error, isPending} = useFetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=&page=1&sparkline=false&price_change_percentage=24h');
const [dataTable, setDataTable] = useState({});
const [userCryptos, setUserCryptos] = useState(null);
const [selectedCrypto, setSelectedCrypto] = React.useState('');
const [open, setOpen] = React.useState(false);

const handleClick = (row) => {
  setSelectedCrypto(row);
  setOpen(true);
};

useEffect(() => {
    fetch("http://localhost:8000/cryptoTransactions").then(res => {
        return res.json()
    }).then(
        userCryptosData => {
          setUserCryptos(userCryptosData);
      })
}, [])

useEffect(() => {
  
  if(data){
    console.log(data)
    let rows = data.map(
      (row, i) => {  
         return {
            clickEvent: () => handleClick(row),
            market_cap_rank: row.market_cap_rank,
            image: <img src={row.image} width="30" />,
            symbol: row.symbol,
            name: row.name,
            price_change_24h:  <p searchvalue={row.price_change_24h} style={ row.price_change_percentage_24h>0 ? { color:'#4eaf0a'} : { color:'red'}}>{(Math.round(row.price_change_24h * 100) / 100).toFixed(2) + "$"}</p>,
            price_change_percentage_24h: <p searchvalue={row.price_change_percentage_24h} style={ row.price_change_percentage_24h>0 ? { color:'#4eaf0a'} : { color:'red'}}>{(Math.round(row.price_change_percentage_24h * 100) / 100).toFixed(2) + "%"}</p>,
            ath: row.ath + "$",
            current_price: row.current_price + "$"
         };
    });
  const dataTable = {
    columns: [
      {
        label: '#',
        field: 'market_cap_rank',
        sort: 'asc',
        width: 20
      },
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
      }
    ],
    rows: rows
  }
  setDataTable(dataTable)
}
  },[data])
  
  return (<div>
    {userCryptos && <UserCryptosList userCryptos={userCryptos} />}
    <CryptoModalWindow open={open} selectedCrypto={selectedCrypto} onClose={() => setOpen(false)} />
    {dataTable &&
    <MDBDataTable
      materialSearch
      hover
      small
      sortRows={['price_change_percentage_24h','price_change_24h']}
      data={dataTable}
    /> }
    </div>
  );
}

export default SearchableList;
