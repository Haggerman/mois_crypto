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
  IconButton,
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
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import CryptoModalWindow from 'src/views/customer/CryptoListView/CryptoModalWindow';

const useStyles = makeStyles({
  root: {},
  image: {
    height: 40,
    width: 40,
    backgroundColor: 'transparent',
    marginRight: 24
  }
});

const Favorites = ({ className, userFavorites, handleUpdate, handleTransaction, userCryptos, cryptoData, ...rest }) => {
  const classes = useStyles();
  
  const [favorites, setFavorites] = useState(userFavorites);
  const [listLength, setLength] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [viewAll, setViewAll] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [open, setOpen] = useState(false);

  const handleClickModal = (row) => {
    setSelectedCrypto(row);
    setOpen(true);
  };
  const handleDeleFavorit = (id) =>{
    fetch('http://localhost:8000/favorites/' + id,
    {method: 'DELETE'}).then(()=>{
        console.log("Deleted");
        handleUpdate();
    }) 
    const newFavorites = favorites.filter(favorite => favorite.id !== id);
    setFavorites(newFavorites);
    if (newFavorites.length > 4){
      if(viewAll){
        setLength(4);
      }
      else{
        setLength(newFavorites.length); 
      }

    }
    else
    {
      setLength(newFavorites.length); 
      setIsVisible(false);
    }
}

  const handleClick = () => {
    if (listLength == favorites.length) {
      if (favorites.length > 4) {
        setLength(4);
      }
      setViewAll(true);
    } else {
      setLength(favorites.length);
      setViewAll(false);
    }
  };
  useEffect(() => {
    if (favorites.length > 4) {
      setLength(4);
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
      let itemData = cryptoData.find(o => o.id === item.id);
      console.log(itemData);
      
      let userCryptoIndex = cryptoIDs.indexOf(item.id);
      let ownedPrice = itemData.current_price * (amounts[userCryptoIndex]?? 0);
      content.push(
        <ListItem divider={i < listLength } key={item.id}>
          <Avatar className={classes.image} src={item.image}></Avatar>
          <ListItemText primary={item.name} secondary={<Typography style={{ color: itemData.price_change_percentage_24h > 0 ? '#4eaf0a' : 'red' }}>{(itemData.price_change_percentage_24h).toFixed(2) + '%'} </Typography>} />
          <ListItemText primary="Price" secondary={<Typography style={{ color: itemData.price_change_percentage_24h > 0 ? '#4eaf0a' : 'red' }}>{"$ "+(itemData.current_price).toFixed(2)} </Typography>} />
          <ListItemText primary="Holdings" secondary={<Typography style={{ color: itemData.price_change_percentage_24h > 0 ? '#4eaf0a' : 'red' }}>{"$ " +(ownedPrice).toFixed(2)}</Typography>} />
          <IconButton  onClick={() => handleClickModal(itemData)} edge="end" size="small">
            <MoreVertIcon  />
          </IconButton>
          <IconButton  onClick={() => handleDeleFavorit(item.id)} edge="end" size="small">
            <DeleteOutlinedIcon  />
          </IconButton>
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
            <Divider />
          </ListItem>
        )}
      </List>
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button
          hidden={isVisible ? false : true}
          color="primary"
          endIcon={viewAll ? <ArrowDropDownIcon/>: <ArrowDropUpIcon/>}
          size="small"
          variant="text"
          onClick={() => handleClick()}
        >
          {viewAll ? "View all" : "View less"}
        </Button>
      </Box>
    </Card>
  );
};

Favorites.propTypes = {
  className: PropTypes.string
};

export default Favorites;
