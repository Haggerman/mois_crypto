/* eslint-disable */
import React from 'react';
import { MDBDataTable } from 'mdbreact';
import { useState, useEffect } from 'react';

const UserCryptosList = ({ userCryptos }) => {
  const [dataTable, setDataTable] = useState({});

  useEffect(() => {
    if (userCryptos) {
      let rows = userCryptos.map((row, i) => {
        let date = new Date(row.date);
        console.log(date);
        return {
          cryptoName: row.cryptoName,
          amount: row.amount,
          action: row.action,
          priceAtDatePerOneCoin:
            '$ ' + row.priceAtDatePerOneCoin.toLocaleString(),
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
            field: 'priceAtDatePerOneCoin',
            width: 150
          },
          {
            label: 'Action',
            field: 'action',
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
      };
      setDataTable(dataTable);
    }
  }, [userCryptos]);
  return (
    <div>
      {dataTable && (
        <MDBDataTable
          entriesOptions={[5, 10, 20, 50]}
          entries={5}
          materialSearch
          sortRows={['date']}
          small
          data={dataTable}
        />
      )}
    </div>
  );
};

export default UserCryptosList;
