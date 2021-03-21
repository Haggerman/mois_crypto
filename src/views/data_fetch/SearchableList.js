/* eslint-disable */
import React from 'react';
import { MDBDataTable } from 'mdbreact';
import { useState, useEffect } from 'react';
import useFetch from './useFetch'
import { Button, MenuItem, Select, TextField } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Graph from './Graph';
import UserCryptosList from './userCryptosList';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 900,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const SearchableList = () => { 
const { data, error, isPending} = useFetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=&page=1&sparkline=false&price_change_percentage=24h');
const [dataTable, setDataTable] = useState({});
const [userCryptos, setUserCryptos] = useState(null);
const [isHidden, setIsHidden] = useState(true);
const [selectedCrypto, setSelectedCrypto] = React.useState('');
const [modalStyle] = React.useState(getModalStyle);
const classes = useStyles();
const [amount, setAmount] = useState('');
const [date, setDate] = useState('');
const [action, setAction] = useState('Bought');

const [open, setOpen] = React.useState(false);

const handleClick = (id) => {
  console.log(Date.now());
  setSelectedCrypto(id);
  setOpen(true); 
};

const handleClose = () => {
  setOpen(false);
  setIsHidden(true);
  setAmount('');
  setDate('');
  setAction('Bought');
  console.log("on close");
};

const handleSubmit = (e) => {
  e.preventDefault();
  let cryptoId = selectedCrypto;
  const crypto = { cryptoId, action, amount, date}
  
  fetch('http://localhost:8000/cryptoTransactions', {
    method: 'POST',
    headers: {"Content-Type": "application/json" },
    body: JSON.stringify(crypto)
  }).then(() => {
    console.log("new crypto transaction added");
  })
}

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
            clickEvent: () => handleClick(row.id),
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
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
      <div style={modalStyle} className={classes.paper}>
        <h2>{selectedCrypto}</h2>
        <Graph  cryptoId={selectedCrypto}/>
        <Button hidden={isHidden ? false : true} variant="contained" color="primary" onClick={() => setIsHidden(false)}>Add transaction</Button>
        <form hidden={isHidden} className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField id="outlined-basic" label="Amount" variant="outlined" value={amount} onChange={(e) => setAmount(e.target.value)}/>
          <TextField
            id="datetime-local"
            label="Transaction time"
            type="datetime-local"
            className={classes.textField}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
          }}
        /> 
        <Select
          value={action}
          onChange={(e) => setAction(e.target.value)}
        >
          <MenuItem value={"Bought"}>Bought</MenuItem>
          <MenuItem value={"Sold"}>Sold</MenuItem>
        </Select>
      <Button type="submit" variant="contained" color="primary" onClick={() => setIsHidden(false) }>Submit</Button>
    </form>
  </div>
      </Modal>

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
