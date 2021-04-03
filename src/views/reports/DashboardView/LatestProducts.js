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
  colors,
  Typography
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import CryptoModalWindow from 'src/views/customer/CryptoListView/CryptoModalWindow';
import { CodeSharp } from '@material-ui/icons';

const useStyles = makeStyles({
  root: {},
  image: {
    height: 40,
    width: 40,
    backgroundColor: 'transparent',
    marginRight: 24
  }
});

const LatestProducts = ({ className, userFavorites, handleUpdate, handleTransactions, ...rest }) => {
  const classes = useStyles();
  
  const [products, setProducts] = useState(userFavorites);
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
    const newProducts = products.filter(product => product.id !== id);
    setProducts(newProducts);
    if (newProducts.length > 4){
      if(viewAll){
        setLength(4);
      }
      else{
        setLength(newProducts.length); 
      }

    }
    else
    {
      setLength(newProducts.length); 
      setIsVisible(false);
    }
}

  const handleClick = () => {
    if (listLength == products.length) {
      if (products.length > 4) {
        setLength(4);
      }
      setViewAll(true);
    } else {
      setLength(products.length);
      setViewAll(false);
    }
  };
  useEffect(() => {
    if (products.length > 4) {
      setLength(4);
      setIsVisible(true);
    } else {
      setLength(products.length);
      setIsVisible(false);
    }
  }, []);

  const getFavorites = products => {
    let content = [];
    for (let i = 0; i < listLength; i++) {
      const item = products[i];
      content.push(
        <ListItem divider={i < listLength } key={item.id}>
          <Avatar className={classes.image} src={item.image}></Avatar>
          <ListItemText primary={item.name} secondary={<Typography style={{ color: item.price_change_percentage_24h > 0 ? '#4eaf0a' : 'red' }}>{(Math.round(item.price_change_24h * 100) / 100).toFixed(2) + '%'}</Typography>} />
          <IconButton  onClick={() => handleClickModal(item)} edge="end" size="small">
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
        handleTransactions={handleTransactions}
      />
      <CardHeader title="Favorites" />
      <Divider />
      <List>
        {listLength > 0 ? (
          getFavorites(products)
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

LatestProducts.propTypes = {
  className: PropTypes.string
};

export default LatestProducts;
