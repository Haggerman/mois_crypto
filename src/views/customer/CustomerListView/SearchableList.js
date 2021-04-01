/* eslint-disable */
import React from 'react';
import clsx from 'clsx';
import { MDBDataTable } from 'mdbreact';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CryptoModalWindow from './CryptoModalWindow';
import {
  Box,
  Card,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const SearchableList = ({ className, cryptoData, handleUpdate, handleTransaction, userFavorites, ...rest }) => {
  const classes = useStyles();
  const [dataTable, setDataTable] = useState({});
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [open, setOpen] = useState(false);
  const [hideFavoritesButton, sethideFavoritesButton] = useState(false);
  const [favorites, setFavorites] = useState(userFavorites);

  const handleClick = row => {
    setSelectedCrypto(row);
    setOpen(true);
    let obj = favorites.find(o => o.id === row.id);
    if(obj){
      sethideFavoritesButton(true);
    }
    else{
      sethideFavoritesButton(false);
    }
  };
  

  useEffect(() => {
    if (cryptoData) {
      let rows = cryptoData.map((row, i) => {
        return {
          clickEvent: () => handleClick(row),
          market_cap_rank: row.market_cap_rank,
          image: <img src={row.image} width="30" />,
          symbol: row.symbol,
          name: row.name,
          price_change_24h: (
            <p
              searchvalue={row.price_change_24h}
              style={
                row.price_change_percentage_24h > 0
                  ? { color: '#4eaf0a' }
                  : { color: 'red' }
              }
            >
              {(Math.round(row.price_change_24h * 100) / 100).toFixed(2) + '$'}
            </p>
          ),
          price_change_percentage_24h: (
            <p
              searchvalue={row.price_change_percentage_24h}
              style={
                row.price_change_percentage_24h > 0
                  ? { color: '#4eaf0a' }
                  : { color: 'red' }
              }
            >
              {(
                Math.round(row.price_change_percentage_24h * 100) / 100
              ).toFixed(2) + '%'}
            </p>
          ),
          ath: row.ath + '$',
          current_price: row.current_price + '$'
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
      };
      setDataTable(dataTable);
    }
  }, []);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <Box p={2}>
        <CryptoModalWindow
          open={open}
          selectedCrypto={selectedCrypto}
          onClose={() => setOpen(false)}
          handleUpdate={handleUpdate}
          hideFavoritesButton={hideFavoritesButton}
          handleTransaction={handleTransaction}
        />
        {dataTable && (
          <MDBDataTable
            entriesOptions={[5, 10, 50, 100]}
            entries={5}
            materialSearch
            hover
            small
            sortRows={['price_change_percentage_24h', 'price_change_24h']}
            data={dataTable}
          />
        )}
      </Box>
    </Card>
  );
};
SearchableList.propTypes = {
  className: PropTypes.string
};

export default SearchableList;
