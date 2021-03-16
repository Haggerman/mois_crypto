import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import * as CryptoIcons from 'react-cryptocoins';
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

const data = [
  {
    id: uuid(),
    name: 'Dropbox',
    imageUrl: <CryptoIcons.Btc />,
    updatedAt: moment().subtract(2, 'hours')
  },
  {
    id: uuid(),
    name: 'Medium Corporation',
    imageUrl: <CryptoIcons.Eth />,
    updatedAt: moment().subtract(2, 'hours')
  },
  {
    id: uuid(),
    name: 'Slack',
    imageUrl: <CryptoIcons.Ltc />,
    updatedAt: moment().subtract(3, 'hours')
  },
  {
    id: uuid(),
    name: 'Lyft',
    imageUrl: <CryptoIcons.Doge />,
    updatedAt: moment().subtract(5, 'hours')
  }
];

const useStyles = makeStyles(({
  root: {
    height: '100%'
  },
  image: {
    height: 40,
    width: 40,
    backgroundColor: colors.common.black,
    marginRight: 24
  }
}));

const LatestProducts = ({ className, ...rest }) => {
  const classes = useStyles();
  const [products] = useState(data);

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        subtitle={`${products.length} in total`}
        title="Current prices"
      />
      <Divider />
      <List>
        {products.map((product, i) => (
          <ListItem
            divider={i < products.length - 1}
            key={product.id}
          >
            <Avatar className={classes.image}>
              {product.imageUrl}
            </Avatar>
            <ListItemText
              primary={product.name}
              secondary={`Updated ${product.updatedAt.fromNow()}`}
            />
            <IconButton
              edge="end"
              size="small"
            >
              <MoreVertIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box
        display="flex"
        justifyContent="flex-end"
        p={2}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </Box>
    </Card>
  );
};

LatestProducts.propTypes = {
  className: PropTypes.string
};

export default LatestProducts;
