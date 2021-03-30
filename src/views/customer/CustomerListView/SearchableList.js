/* eslint-disable */
import React from 'react';
import clsx from 'clsx';
import { MDBDataTable } from 'mdbreact';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CryptoModalWindow from './CryptoModalWindow';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const SearchableList = ({ className, cryptoData, ...rest }) => {
  const classes = useStyles();
  const [dataTable, setDataTable] = useState({});
  const [selectedCrypto, setSelectedCrypto] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleClick = row => {
    setSelectedCrypto(row);
    setOpen(true);
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
