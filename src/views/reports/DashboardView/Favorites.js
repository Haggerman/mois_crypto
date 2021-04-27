/* eslint-disable */
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  CardContent,
  List,
  ListItem,
  Avatar,
  ListItemText,
  makeStyles,
  Typography
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClearIcon from '@material-ui/icons/Clear';
import CryptoModalWindow from 'src/views/customer/CryptoListView/CryptoModalWindow';
import Tooltip from '@material-ui/core/Tooltip';
import Cookies from 'js-cookie';
import removeTrailingZeros from 'remove-trailing-zeros';
import refreshToken from 'src/views/auth/refreshToken';
import NumberConverter from 'src/utils/NumberConverter';

const useStyles = makeStyles({
  root: {},
  image: {
    height: 40,
    width: 40,
    backgroundColor: 'transparent',
    marginRight: 5
  },
  fit: {
    width: '100%'
  }
});

const Favorites = ({
  className,
  userFavorites,
  handleUpdate,
  handleTransaction,
  userCryptos,
  cryptoData, 
  ...rest
}) => {
  const classes = useStyles();

  const [favorites, setFavorites] = useState(userFavorites);
  const [listLength, setLength] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [viewAll, setViewAll] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [open, setOpen] = useState(false);
  const [cryptoId, setDeleteFavoriteId] = useState(null);
  const [isClicked, setClicked] = useState(false);


  const handleRefresh = () => {
    setClicked(false);
    let accessToken = Cookies.get('access');
    fetch('https://cryptfolio.azurewebsites.net/api/FavoriteCrypto/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + accessToken
      },
      body: JSON.stringify({ CryptoId: cryptoId })
    }).then(() => {
      handleUpdate();
    });
    const newFavorites = favorites.filter(
      favorite => favorite.cryptoId !== cryptoId
    );
    setFavorites(newFavorites);
    if (newFavorites.length > 3) {
      if (viewAll) {
        setLength(3);
      } else {
        setLength(newFavorites.length);
      }
    } else {
      setLength(newFavorites.length);
      setIsVisible(false);
    }
  }



  const {} = refreshToken(isClicked, handleRefresh)

  const handleClickModal = row => {
    setSelectedCrypto(row);
    setOpen(true);
  };
  const handleDeleFavorit = cryptoId => {
    setClicked(true);
    setDeleteFavoriteId(cryptoId);
  };

  const handleClick = () => {
    if (listLength == favorites.length) {
      if (favorites.length > 3) {
        setLength(3);
      }
      setViewAll(true);
    } else {
      setLength(favorites.length);
      setViewAll(false);
    }
  };

  useEffect(() => {
    if (favorites.length > 3) {
      setLength(3);
      setIsVisible(true);
    } else {
      setLength(favorites.length);
      setIsVisible(false);
    }
  }, []);

  const getFavorites = favoriteItem => {
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
    let content = [];
    for (let i = 0; i < listLength; i++) {
      const item = favoriteItem[i];
      if(item){
      let itemData = cryptoData.find(o => o.id === item.cryptoId);
      let userCryptoIndex = cryptoIDs.indexOf(item.cryptoId);
      let ownedPrice = itemData.currentPrice * (amounts[userCryptoIndex] ?? 0);
      content.push(
        <ListItem key={item.cryptoId}>
          <Card className={clsx(classes.fit, className)} {...rest}>
            <CardContent style={{ padding: '10px' }}>
              <Grid container justify="space-between" spacing={1}>
                <Grid item>
                  <Typography color="textPrimary" gutterBottom variant="h5">
                    {itemData.name}
                  </Typography>
                  <Avatar
                    className={classes.image}
                    src={itemData.image}
                    style={{ display: 'block' }}
                  ></Avatar>
                </Grid>
                <Grid item>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Amount
                  </Typography>
                  <Typography color="textSecondary">
                    {amounts[userCryptoIndex] > 0
                      ? removeTrailingZeros(amounts[userCryptoIndex].toFixed(6))
                      : amounts[userCryptoIndex] != 0 && amounts[userCryptoIndex] ? removeTrailingZeros(amounts[userCryptoIndex].toFixed(6)) : 0}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Holdings
                  </Typography>
                  {
                    <Typography
                      noWrap
                      style={{
                        color:
                          ownedPrice > 0 ? itemData.priceChangePercentage24H > 0
                            ? '#4eaf0a'
                            : 'red'
                            : '#546e7a'
                      }}
                    >
                      <NumberConverter number={ownedPrice} />
                    </Typography>
                  }
                </Grid>
                <Grid item>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Price
                  </Typography>
                  {
                    <Typography
                      style={{
                        color:
                          itemData.priceChangePercentage24H > 0
                            ? '#4eaf0a'
                            : 'red'
                      }}
                    >
                      {<NumberConverter number={itemData.currentPrice} />}{' '}
                    </Typography>
                  }
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Change
                  </Typography>
                  {
                    <Typography
                      style={{
                        color:
                          itemData.priceChangePercentage24H > 0
                            ? '#4eaf0a'
                            : 'red'
                      }}
                    >
                      {itemData.priceChangePercentage24H.toFixed(2) + '%'}{' '}
                    </Typography>
                  }
                </Grid>
                <Grid item>
                  <Typography gutterBottom variant="button">
                    <Tooltip title="Remove from favorites">
                      <IconButton
                        onClick={() => handleDeleFavorit(item.cryptoId)}
                        edge="end"
                        size="small"
                      >
                        <ClearIcon />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                  <Box height={1 / 4}></Box>
                  <Typography>                    
                  <Tooltip title="More information">
                    <IconButton
                      onClick={() => handleClickModal(itemData)}
                      edge="end"
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                    </Tooltip>
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </ListItem>
      );}
    }
    return content;
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CryptoModalWindow
        open={open}
        selectedCrypto={selectedCrypto}
        onClose={() => setOpen(false)}
        handleUpdate={handleUpdate}
        hideFavoritesButton={true}
        handleTransaction={handleTransaction}
      />
      <Typography color="textSecondary" style={{ padding: '12px' }} variant="h6">
        FAVORITES
      </Typography>
      <List style={{ paddingTop: '0px' }}>
        {listLength > 0 ? (
          getFavorites(favorites)
        ) : (
          <ListItem>
            <ListItemText primary={'Favorites list is empty'} />
          </ListItem>
        )}
      </List>
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button
          hidden={isVisible ? false : true}
          color="primary"
          endIcon={viewAll ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
          size="small"
          variant="text"
          onClick={() => handleClick()}
        >
          {viewAll ? 'View all' : 'View less'}
        </Button>
      </Box>
    </Card>
  );
};

Favorites.propTypes = {
  className: PropTypes.string
};

export default Favorites;
