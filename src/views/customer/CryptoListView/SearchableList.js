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
import Cookies from 'js-cookie';
import refreshToken from 'src/views/auth/refreshToken';
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
  const [isFavorite, setFavorite] = useState(null);
  const [row, setRow] = useState(null);
  const [isClicked, setClicked] = useState(false);

  const handleClick = (row) => {
      setSelectedCrypto(row);
      setOpen(true);
  };
  const handleRefresh = () => {
    let accessToken  = Cookies.get("access");
    if(!isFavorite){
      fetch('https://cryptfolio.azurewebsites.net/api/FavoriteCrypto/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 
          'authorization' : 'Bearer ' + accessToken  
        },
        body: JSON.stringify({CryptoId: row.id})
      }).then(() => {
        handleUpdate(); 
        setClicked(false);
      });
    } else{
      fetch('https://cryptfolio.azurewebsites.net/api/FavoriteCrypto/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 
          'authorization' : 'Bearer ' + accessToken  
        },
        body: JSON.stringify({CryptoId: row.id})
      }).then(() => {
        handleUpdate();
        setClicked(false);
      });
    }
  }

  const handleFavorite = (row, isFavorite) => {
    setRow(row);
    setFavorite(isFavorite);
    setClicked(true);
  };
  

  const {} = refreshToken(isClicked, handleRefresh)
  useEffect(() => {    
    if (cryptoData && userCryptos && favorites) {
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
      let rows = cryptoData.map((row) => {
        let userCryptoIndex = cryptoIDs.indexOf(row.id);
        let ownedPrice = row.currentPrice * (amounts[userCryptoIndex]?? 0);
        return {
          marketCapRank: row.marketCapRank,
          image: <img src={row.image} width="30" />,
          symbol: row.symbol,
          currentPrice: <p searchvalue={row.currentPrice}>{'$ ' + row.currentPrice.toLocaleString()}</p> ,
          name: row.name,
          ownedPrice: <p searchvalue={ownedPrice}>{'$ ' + ownedPrice.toLocaleString()}</p>,
          priceChange24H: (
            <p
              searchvalue={row.priceChange24H}
              style={
                row.priceChangePercentage24H > 0
                  ? { color: '#4eaf0a' }
                  : { color: 'red' }
              }
            >
              {'$ '+(Math.round(row.priceChange24H * 100) / 100).toFixed(2).toLocaleString()}
            </p>
          ),
          priceChangePercentage24H: (
            <p
              searchvalue={row.priceChangePercentage24H}
              style={
                row.priceChangePercentage24H > 0
                  ? { color: '#4eaf0a' }
                  : { color: 'red' }
              }
            >
              {(
                Math.round(row.priceChangePercentage24H * 100) / 100
              ).toFixed(2).toLocaleString() + '%'}
            </p>
          ),
          ath: '$ ' + row.ath.toLocaleString(),
          isFavorites: row.isFavorite ? (
            <IconButton className="icon" color="primary" onClick={() => handleFavorite(row, row.isFavorite)} searchvalue="a" className={classes.icon}>
              <FavoriteIcon />
          </IconButton>
          ) : (
            <IconButton className="icon" color="secondary" onClick={() => handleFavorite(row, row.isFavorite)} searchvalue="b" className={classes.icon}>
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
            field: 'marketCapRank',
            sort: 'asc',
            width: 20
          },
          {
            label: 'Icon',
            field: 'image',
            sort: 'disabled',
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
            field: 'currentPrice',
            width: 150
          },
          {
            label: 'Price change 24h',
            field: 'priceChange24H',
            width: 200
          },
          {
            label: 'Percent change 24h',
            field: 'priceChangePercentage24H',
            width: 200
          },
          {
            label: 'ATH',
            field: 'ath',
            width: 100
          },
          {
            label: <Box height="10" width="10"><IconButton color="primary" searchvalue="a" height="10" className={classes.icon}>
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
  }, [userFavorites, cryptoData]);

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
            entries={10}
            materialSearch
            disableRetreatAfterSorting={true}
            small
            sortRows={['ownedPrice', 'priceChangePercentage24H', 'currentPrice', 'priceChange24H', "isFavorites"]}
            order={['marketCapRank', 'asc']}
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
