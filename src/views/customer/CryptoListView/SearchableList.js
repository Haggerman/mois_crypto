/* eslint-disable */
import React from 'react';
import clsx from 'clsx';
import { MDBDataTable } from 'mdbreact';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CryptoModalWindow from './CryptoModalWindow';
import NotFavoriteIcon from '@material-ui/icons/FavoriteBorderOutlined';
import FavoriteIcon  from '@material-ui/icons/Favorite';
import Cookies from 'js-cookie';
import refreshToken from 'src/views/auth/refreshToken';
import NumberConverter from 'src/utils/NumberConverter';
import Link from '@material-ui/core/Link';
import {
  Box,
  Card,
  IconButton,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  table: {
    [theme.breakpoints.down("sm")]: {
     overflowY:"auto"
    }
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  icon: {
    padding: "0px"
  }
}));

const SearchableList = ({ className, cryptoData, handleUpdate, handleTransaction, userFavorites, userCryptos, ...rest }) => {
  const classes = useStyles();
  const [dataTable, setDataTable] = useState(null);
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
         ath: <NumberConverter number={row.ath} searchvalue={row.ath} />,
          currentPrice: <p searchvalue={row.currentPrice}><NumberConverter number={row.currentPrice} /></p> ,
          name:   <Link searchvalue= {row.name} href="#"onClick={() => handleClick(row)} color="inherit">
          {row.name}
        </Link>,
          ownedPrice: <p searchvalue={ownedPrice}><NumberConverter number={ownedPrice} /></p>,
          priceChange24H: (
            <p
              searchvalue={row.priceChange24H}
              style={
                row.priceChangePercentage24H > 0
                  ? { color: '#4eaf0a' }
                  : { color: 'red' }
              }
            >
              <NumberConverter number={row.priceChange24H} />
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
          isFavorites: row.isFavorite ? (
            <IconButton className="icon" color="primary" onClick={() => handleFavorite(row, row.isFavorite)} searchvalue="a" className={classes.icon}>
              <FavoriteIcon />
          </IconButton>
          ) : (
            <IconButton className="icon" color="secondary" onClick={() => handleFavorite(row, row.isFavorite)} searchvalue="b" className={classes.icon}>
              <NotFavoriteIcon />
          </IconButton>
          )
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
            label: 'Price',
            field: 'currentPrice',
            width: 200
          },
          {
            label: 'Price change 24h',
            field: 'priceChange24H',
            width: 150
          },
          {
            label: 'Percent change 24h',
            field: 'priceChangePercentage24H',
            width: 80
          },
          {
            label: 'All time high',
            field: 'ath',
            width: 80
          },
          {
            label: <Box height="10" width="10"><IconButton color="primary" searchvalue="a" height="10" className={classes.icon}>
            <FavoriteIcon />
        </IconButton>
        </Box>,
            field: 'isFavorites',
            width: 20
          }
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
            className={classes.table}
            entriesOptions={[5, 10, 50, 100]}
            entries={10}
            materialSearch
            disableRetreatAfterSorting={true}
            small
            sortRows={['name', 'ownedPrice', 'priceChangePercentage24H', 'currentPrice', 'priceChange24H', "isFavorites", "ath"]}
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
