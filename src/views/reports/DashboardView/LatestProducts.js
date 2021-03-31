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
  colors
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const useStyles = makeStyles(({
  root: {
    
  },
  image: {
    height: 40,
    width: 40,
    backgroundColor: colors.common.black,
    marginRight: 24
  }
}));

const LatestProducts = ({ className, userFavorites, ...rest }) => {
  const classes = useStyles();
  const [products] = useState(userFavorites);
  const [listLength, setLength]= useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [buttonText, setButton]= useState("View all");
  const handleClick = () => {
    if(listLength == products.length){
    if (products.length > 4){
    setLength(4);
    }
    setButton("View all");
    }
    else{
      setLength(products.length);
      setButton("View less");
    }
}
useEffect(()=> {
  if (products.length > 4){
    setLength(4);
    setIsVisible(true);
    }
    else{
      setLength(products.length); 
    }

}, [userFavorites]) 

  const getFavorites = products => {
    let content = []; 
    for (let i = 0; i < listLength; i++) {
      const item = products[i];
      content.push(          <ListItem
        divider={i < listLength - 1}
        key={item.id}
      >
        <Avatar className={classes.image} src= {item.image}>
        </Avatar>
        <ListItemText
          primary={item.cryptoName}
        />
        <IconButton
          edge="end"
          size="small"
        >
          <MoreVertIcon />
        </IconButton>
      </ListItem>);
    }
    if(listLength > 0){
    content.push(<Divider />)
    }
    return content;
  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        title="Favorites"
      />
      <Divider />
      <List>
      {listLength > 0 ?  getFavorites(products) :
       <ListItem
     >
       <ListItemText
         primary={"Favorite list is empty"}
       />
     </ListItem>
      }
     
      </List>
      <Box
        display="flex"
        justifyContent="flex-end"
        p={2}
      >
        <Button
          hidden={isVisible ? false : true}
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
          onClick={handleClick}
        >
          {buttonText}
        </Button>
      </Box>
    </Card>
  );
};

LatestProducts.propTypes = {
  className: PropTypes.string
};

export default LatestProducts;
