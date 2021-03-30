/* eslint-disable */
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  colors
} from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import useFetch from 'src/views/customer/CustomerListView/useFetch';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.indigo[600],
    height: 56,
    width: 56
  }
}));

const TotalProfit = ({ className, userCryptos, portfolioAmount, cryptoData, ...rest }) => {
  const classes = useStyles();
  const [profit, setProfit] = useState(0);

  let result = userCryptos.reduce((c, v) => {
    if (v.action == 'Sold') {
      c[v.cryptoId] = (c[v.cryptoId] || 0) - v.amount;
    } else {
      c[v.cryptoId] = (c[v.cryptoId] || 0) + v.amount;
    }
    return c;
  }, {});

  let amounts = Object.values(result);
  let cryptoIDs = Object.keys(result);
  useEffect(() => {
    if (cryptoData) {
      let currentGain = 0;
      cryptoIDs.forEach((element, index) => {
        let obj = cryptoData.find(o => o.id === cryptoIDs[index]);
        currentGain += obj.current_price * amounts[index];
      });
      const profit = currentGain - portfolioAmount;
      setProfit(profit);
    }
  }, [portfolioAmount]);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              TOTAL PROFIT
            </Typography>
            {profit > 0 ? (
              <Typography style={{color:"#4eaf0a"}} variant="h3">
                {'$' + Math.abs(profit).toLocaleString()}
              </Typography>
            ) : (
              <Typography style={{color:"red"}} variant="h3">
                {'-$' + Math.abs(profit).toLocaleString()}
              </Typography>
            )}
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <AttachMoneyIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

TotalProfit.propTypes = {
  className: PropTypes.string
};

export default TotalProfit;
