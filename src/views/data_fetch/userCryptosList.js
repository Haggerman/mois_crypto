/* eslint-disable */
import React from 'react';
import { MDBDataTable } from 'mdbreact';
import { useState, useEffect } from 'react';

const UserCryptosList = ({ userCryptos }) => {
    const [dataTable, setDataTable] = useState({});

      useEffect(() => {
  
        if(userCryptos){
        userCryptos.forEach(element => {
            
        });
          let rows = userCryptos.map(
            (row, i) => {  
                let date = new Date(row.date);
               return {
                  cryptoId: row.cryptoId,
                  amount: row.amount,     
                  action: row.action,
                  date: Intl.DateTimeFormat('cz-CZ', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  }).format(date)            
               };
          });
        const dataTable = {
          columns: [
            {
              label: 'Crypto',
              field: 'cryptoId',
              sort: 'asc',
              width: 150
            },
            {
              label: 'Amount',
              field: 'amount',
              sort: 'asc',
              width: 150
            },
            {
              label: 'Action',
              field: 'action',
              sort: 'asc',
              width: 150
            },
            {
              label: 'Date',
              field: 'date',
              sort: 'asc',
              width: 150
            }
          ],
          rows: rows
        }
        setDataTable(dataTable)
      }
        },[userCryptos])
    console.log(userCryptos);
    console.log("test");
    return (
        <div>
           {dataTable &&
    <MDBDataTable
      striped
      bordered
      small
      data={dataTable}
    /> }
        </div>
    )
}

export default UserCryptosList;