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
import NumericLabel from 'react-pretty-numbers';



const TotalProfit = ({ className, userCryptos, portfolioAmount, cryptoData, ...rest }) => {
  
  const [profit, setProfit] = useState(0);
  const [percentChange, setPercentChange] = useState(0);

  useEffect(() => {
    if(userCryptos && portfolioAmount != null && cryptoData){
      let totalProfit = 0;
      let initialInvestment = 0;
      userCryptos.map((row, i) => { 
        let obj = cryptoData.find(o => o.id === row.cryptoId);
        if(obj){
        let currentPrice = obj.currentPrice;
        if(row.action === 'Buy'){
          initialInvestment = initialInvestment + row.amount*row.priceAtDatePerCoin;
          totalProfit = totalProfit + (currentPrice - row.priceAtDatePerCoin)*row.amount
        }
        else{
          totalProfit = totalProfit - (currentPrice - row.priceAtDatePerCoin)*row.amount 
        }
      }
      });
      setProfit(totalProfit);
      setPercentChange( totalProfit*100 / initialInvestment );
    }
  }, [portfolioAmount, userCryptos, cryptoData]);
  
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
  let params = {
    locales : 'en-US',
    currency: true,
    precision: 2,
    commafy: true, 
    shortFormat: true,
    shortFormatMinValue: 1000000,
    title: false,
    cssClass: ['class1', 'class2']
  };
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
                {/*'$' + Math.abs(profit).toLocaleString()*/
                  <NumericLabel params={params}>{profit}</NumericLabel>
                }
               
              </Typography>
            ) : (
              <Typography style={{color:"red"}} variant="h3">
                <NumericLabel params={params}>{profit}</NumericLabel>
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
          <Typography
            className={classes.differenceValue}
            variant="body2"
          >
            {percentChange ? percentChange >= 0 ? <ArrowUpwardIcon className={classes.differenceIcon} /> : <ArrowDownwardIcon className={classes.differenceIcon }  /> : null } {percentChange ? percentChange.toFixed(2).toLocaleString() : 0 }%
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
