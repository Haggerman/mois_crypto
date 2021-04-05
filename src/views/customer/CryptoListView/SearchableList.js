/* eslint-disable */
import React from 'react';
import clsx from 'clsx';
import { MDBDataTable } from 'mdbreact';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CryptoModalWindow from './CryptoModalWindow';
import NotFavoriteIcon from '@material-ui/icons/FavoriteBorderOutlined';
import FavoriteIcon  from '@material-ui/icons/Favorite';
import {
  Box,
  Card,
  IconButton,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  },
  icon: {
    padding: "0px"
  }
}));

const SearchableList = ({ className, cryptoData, handleUpdate, handleTransaction, userFavorites, userCryptos, ...rest }) => {
  const classes = useStyles();
  const [dataTable, setDataTable] = useState({});
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [open, setOpen] = useState(false);
  const [favorites, setFavorites] = useState(userFavorites);

  const handleClick = (row) => {
      setSelectedCrypto(row);
      setOpen(true);
  };

  const handleFavorite = (row, isFavorite) => {
    let id = row.id;
    let name = row.name;
    let image = row.image;
    const crypto = { id, name, image };
    if(!isFavorite){
      userFavorites.push(crypto);
      fetch('http://localhost:8000/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(crypto)
      }).then(() => {
        handleUpdate();
      });
    } else{
      let newFavourites = userFavorites.filter(favourite => favourite.id !== id);
      setFavorites(newFavourites);
      fetch('http://localhost:8000/favorites/' + id, {
        method: 'DELETE'
    }).then(() => {
      handleUpdate();
    })
    }
  };
  

  useEffect(() => {    
    if (cryptoData) {
      const result = userCryptos.reduce((c, v) => {
        if (v.action == 'Sold') {
          c[v.cryptoId] = (c[v.cryptoId] || 0) - v.amount;
        } else {
          c[v.cryptoId] = (c[v.cryptoId] || 0) + v.amount;
        }
        return c;
      }, {});
    
      let amounts = Object.values(result);
      let cryptoIDs = Object.keys(result);
      let rows = cryptoData.map((row, i) => {
        let obj = favorites.find(o => o.id === row.id);
        let isFavorite = false;
        if(obj){
          isFavorite = true;          
        }
        let userCryptoIndex = cryptoIDs.indexOf(row.id);
        let ownedPrice = row.current_price * (amounts[userCryptoIndex]?? 0);
        return {
          market_cap_rank: row.market_cap_rank,
          image: <img src={row.image} width="30" />,
          symbol: row.symbol,
          current_price: <p searchvalue={row.current_price}>{'$ ' + row.current_price.toLocaleString()}</p> ,
          name: row.name,
          ownedPrice: <p searchvalue={ownedPrice}>{'$ ' + ownedPrice.toLocaleString()}</p>,
          price_change_24h: (
            <p
              searchvalue={row.price_change_24h}
              style={
                row.price_change_percentage_24h > 0
                  ? { color: '#4eaf0a' }
                  : { color: 'red' }
              }
            >
              {'$ '+(Math.round(row.price_change_24h * 100) / 100).toFixed(2).toLocaleString()}
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
              ).toFixed(2).toLocaleString() + '%'}
            </p>
          ),
          ath: '$ ' + row.ath.toLocaleString(),
          isFavorites: isFavorite ? (
            <IconButton className="icon" color="primary" onClick={() => handleFavorite(row, isFavorite)} searchvalue="a" className={classes.icon}>
              <FavoriteIcon />
          </IconButton>
          ) : (
            <IconButton className="icon" color="secondary" onClick={() => handleFavorite(row, isFavorite)} searchvalue="b" className={classes.icon}>
              <NotFavoriteIcon />
          </IconButton>
          ),
          detail: 
            <IconButton className="icon" color="primary" onClick={() => handleClick(row)} className={classes.icon}>
              <MoreVertIcon />
          </IconButton>
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
            width: 150
          },
          {
            label: 'Name',
            field: 'name',
            width: 150
          },
          {
            label: 'Holdings',
            field: 'ownedPrice',
            width: 150
          },
          {
            label: 'Symbol',
            field: 'symbol',
            width: 270
          },
          {
            label: 'Price',
            field: 'current_price',
            width: 150
          },
          {
            label: 'Price change 24h',
            field: 'price_change_24h',
            width: 200
          },
          {
            label: 'Percent change 24h',
            field: 'price_change_percentage_24h',
            width: 200
          },
          {
            label: 'ATH',
            field: 'ath',
            width: 100
          },
          {
            label: <Box height="10" width="10"><IconButton color="primary" onClick={() => handleFavorite(row, isFavorite)} searchvalue="a" height="10" className={classes.icon}>
            <FavoriteIcon />
        </IconButton>
        </Box>,
            field: 'isFavorites',
            width: 20
          },
          {
            field: 'detail',
            sort: 'disabled'
          },
        ],
        rows: rows
      };
      setDataTable(dataTable);
    }
  }, [userFavorites]);

  useEffect(() => {
    setFavorites(userFavorites);
  }, [userFavorites]);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <Box p={2}>
        <CryptoModalWindow
          open={open}
          selectedCrypto={selectedCrypto}
          onClose={() => setOpen(false)}
          handleUpdate={handleUpdate}
          handleTransaction={handleTransaction}
        />
        {dataTable && (
          <MDBDataTable
            entriesOptions={[5, 10, 50, 100]}
            entries={5}
            materialSearch
            small
            sortRows={['ownedPrice', 'price_change_percentage_24h', 'current_price', 'price_change_24h', "isFavorites"]}
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
