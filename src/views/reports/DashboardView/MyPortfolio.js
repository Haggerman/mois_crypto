/* eslint-disable */
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.red[600],
    height: 56,
    width: 56
  },
  differenceIcon: {
    color: colors.green[600]
  },
  differenceValue: {
    color: colors.green[600],
    marginRight: theme.spacing(1)
  }
}));

const MyPortfolio = ({userCryptos, cryptoData}) => {
  
  let portfolioAmount=0;
  const classes = useStyles();
  if(userCryptos && cryptoData){
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
    
      if (cryptoData) {
        cryptoIDs.forEach((element, index) => {
          let obj = cryptoData.find(o => o.id === cryptoIDs[index]);
          portfolioAmount += obj.currentPrice * amounts[index];
        });
    }
  }
  return (
    <Card
      className={clsx(classes.root, 'dashboard')}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
            >
              MY PORTFOLIO
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
            ${portfolioAmount.toLocaleString()}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <AttachMoneyIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box
          mt={2}
          display="flex"
          alignItems="center"
        >
          <ArrowUpwardIcon className={classes.differenceIcon} />
          <Typography
            className={classes.differenceValue}
            variant="body2"
          >
            33.6%
          </Typography>
          <Typography
            color="textSecondary"
            variant="caption"
          >
            Since last month
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

MyPortfolio.propTypes = {
  className: PropTypes.string
};

export default MyPortfolio;
