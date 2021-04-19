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
  colors,
  Box
} from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import MoneyIcon from '@material-ui/icons/Money';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';



const TotalProfit = ({ className, userCryptos, portfolioAmount, cryptoData, ...rest }) => {
  
  const [profit, setProfit] = useState(0);
  const [percentChange, setPercentChange] = useState(0);
  let amounts;
  let cryptoIDs;
  if(userCryptos && portfolioAmount && cryptoData){
  const result = userCryptos.reduce((c, v) => {
    if (v.action == 'Sold') {
      c[v.cryptoId] = (c[v.cryptoId] || 0) - v.amount;
    } else {
      c[v.cryptoId] = (c[v.cryptoId] || 0) + v.amount;
    }
    return c;
  }, {});

  amounts = Object.values(result);
  cryptoIDs = Object.keys(result);
  }
  useEffect(() => {
    if (userCryptos && portfolioAmount && cryptoData) {
      let currentGain = 0;
      cryptoIDs.forEach((element, index) => {
        let obj = userCryptos.find(o => o.cryptoId === cryptoIDs[index]);
        currentGain += obj.priceAtDatePerCoin * amounts[index];
      });
      const profit = portfolioAmount - currentGain;
      setProfit(profit);
      setPercentChange(profit / portfolioAmount * 100);
    }
  }, [portfolioAmount]);
  
  const useStyles = makeStyles((theme) => ({
    root: {
      height: '100%'
    },
    avatar: {
      backgroundColor: colors.indigo[500],
      height: 56,
      width: 56
    },
    differenceIcon: {
      color: profit < 0 ? colors.red[600] : colors.green[600]
    },
    differenceValue: {
      color: profit < 0 ? colors.red[600] : colors.green[600],
      marginRight: theme.spacing(1)
    }
  }));

  const classes = useStyles();
  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              TOTAL PROFIT
            </Typography>
            {profit >= 0 ? (
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
              <MoneyIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box
          mt={2}
          display="flex"
          alignItems="center"
        >
          {percentChange >= 0 ? <ArrowUpwardIcon className={classes.differenceIcon} /> : <ArrowDownwardIcon className={classes.differenceIcon} /> }
          <Typography
            className={classes.differenceValue}
            variant="body2"
          >
            {percentChange.toFixed(2).toLocaleString()}%
          </Typography>
          <Typography
            color="textSecondary"
            variant="caption"
          >
            In total
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

TotalProfit.propTypes = {
  className: PropTypes.string
};

export default TotalProfit;
