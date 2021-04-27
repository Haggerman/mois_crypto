/* eslint-disable */
import React from 'react';
import { MDBDataTable } from 'mdbreact';
import { useState, useEffect } from 'react';
import NumberConverter from 'src/utils/NumberConverter';
import { IconButton, makeStyles } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import refreshToken from 'src/views/auth/refreshToken';

const UserCryptosList = ({ userCryptos, cryptoData, handleTransaction}) => {
  const [dataTable, setDataTable] = useState(null);  
  const [isClicked, setClicked] = useState(false);
  const [row, setRow] = useState(null);
  const [userTransactions, setUserTransactions] = useState(userCryptos);

  const useStyles = makeStyles(theme => ({
    table: {
      [theme.breakpoints.down("sm")]: {
       overflowY:"auto"
      }
    }
  }));

const handleRefresh = () => {
  let accessToken  = Cookies.get("access");
    fetch('TODO', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 
        'authorization' : 'Bearer ' + accessToken  
      },
      body: JSON.stringify({CryptoId: row.id})
    }).then(() => {
      handleTransaction(); 
      setClicked(false);
    });
}

  const handleDelete = (row) => {
    let filtered = userTransactions.filter(t=>t.id != row.id);
    setUserTransactions(filtered);
    setRow(row);
    setClicked(true);
  };
  const {} = refreshToken(isClicked, handleRefresh)

  useEffect(() => {    
    setUserTransactions(userCryptos);
  }, [userCryptos]);
  
  useEffect(() => {
    if (cryptoData) {
      let rows = userTransactions.map((row, i) => {
        let date = new Date(row.date);
        let currentPrice = 0;
        let cryptoName = '';
        let profit = 0;
        let obj = cryptoData.find(o => o.id === row.cryptoId);
        if(obj){
        currentPrice = obj.currentPrice;
        cryptoName = obj.name;
        }
        if(row.action === 'Buy'){
          profit = (currentPrice - row.priceAtDatePerCoin)*row.amount
        }
        else{
          profit = - (currentPrice - row.priceAtDatePerCoin)*row.amount 
        }
        return {
          cryptoName: cryptoName,
          amount: row.amount,
          action: row.action,
          priceAtDatePerCoin:
            <p searchvalue={row.priceAtDatePerCoin}><NumberConverter number={row.priceAtDatePerCoin} /></p>,
          profit: (
            <p
              searchvalue={profit}
              style={
                profit > 0
                  ? { color: '#4eaf0a' }
                  : { color: 'red' }
              }
            >
              <NumberConverter number={profit} />
            </p>
          ),
          date: (
            <p searchvalue={date.getTime()}>
              {date > 0
                ? Intl.DateTimeFormat('cz-CZ', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  }).format(date)
                : 'Unknown'}
            </p>
          ),delete:(
            <IconButton className="icon" color="secondary" onClick={() => handleDelete(row)} className={classes.icon}>
              <DeleteForeverIcon />
          </IconButton>
          )
        };
      });
      const dataTable = {
        columns: [
          {
            label: 'Crypto',
            field: 'cryptoName',
            width: 150
          },
          {
            label: 'Amount',
            field: 'amount',
            width: 150
          },
          {
            label: 'Price per coin',
            field: 'priceAtDatePerCoin',
            width: 150
          },
          {
            label: 'Action',
            field: 'action',
            width: 150
          },
          {
            label: 'Profit',
            field: 'profit',
            width: 150
          },
          {
            label: 'Date',
            field: 'date',
            sort: 'asc',
            width: 150
          },
          {
            field: 'delete',
            width: 20
          }
        ],
        rows: rows
      };
      setDataTable(dataTable);
    }
  }, [userTransactions, userCryptos]);
  
  const classes = useStyles();
  return (
    <div>
      {dataTable && (
        <MDBDataTable
          className={classes.table}
          entriesOptions={[5, 10, 20, 50]}
          entries={5}
          materialSearch
          sortRows={['priceAtDatePerCoin','date','profit']}
          small
          data={dataTable}
        />
      )}
    </div>
  );
};

export default UserCryptosList;
