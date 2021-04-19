/* eslint-disable */
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
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

  const handleClickModal = row => {
    setSelectedCrypto(row);
    setOpen(true);
  };
  const handleDeleFavorit = id => {
    fetch('http://localhost:8000/favorites/' + id, { method: 'DELETE' }).then(
      () => {
        console.log('Deleted');
        handleUpdate();
      }
    );
    const newFavorites = favorites.filter(favorite => favorite.id !== id);
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
      if (v.action == 'Sell') {
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
      let itemData = cryptoData.find(o => o.id === item.cryptoId);
      let userCryptoIndex = cryptoIDs.indexOf(item.cryptoId);
      let ownedPrice = itemData.currentPrice * (amounts[userCryptoIndex] ?? 0);
      content.push(
        <ListItem key={item.id}>
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
                    {amounts[userCryptoIndex] > 0?
                      amounts[userCryptoIndex].toFixed(7): 0}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Holdings
                  </Typography>
                  {
                    <Typography
                      noWrap
                      style={{
                        color:
                          itemData.priceChangePercentage24H > 0
                            ? '#4eaf0a'
                            : 'red'
                      }}
                    >
                      {'$' + ownedPrice.toFixed(2)}
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
                      {'$' + itemData.currentPrice.toFixed(2)}{' '}
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
                        onClick={() => handleDeleFavorit(item.id)}
                        edge="end"
                        size="small"
                      >
                        <ClearIcon />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                  <Box height={1 / 4}></Box>
                  <Typography>
                    <IconButton
                      onClick={() => handleClickModal(itemData)}
                      edge="end"
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </ListItem>
      );
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
      <CardHeader title="Favorites" />
      <Divider />
      <List>
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
