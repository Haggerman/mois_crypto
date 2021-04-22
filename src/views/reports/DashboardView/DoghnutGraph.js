/* eslint-disable */
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import * as CryptoIcons from 'react-cryptocoins';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles,
  useTheme
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  }
}));

const DoghnutGraph = ({
  className,
  userCryptos,
  portfolioAmount,
  cryptoData,
  ...rest
}) => {
  let cryptos = [];
  const classes = useStyles();
  const theme = useTheme();
  let result = userCryptos.reduce((c, v) => {
    if (v.action == 'Sold') {
      c[v.cryptoId] =
        (c[v.cryptoId] || 0) - v.amount;
    } else {
      c[v.cryptoId] =
        (c[v.cryptoId] || 0) + v.amount;
    }
    return c;
  }, {});

  
  let amount = Object.values(result);
  let prices = [];
  let cryptoNames = Object.keys(result);
  let myPortfolio = 0;
  let clearedNames = [];
  let clearedAmount = [];
  cryptoNames.forEach((element, index) => {
    if (amount[index] <= 0 ) {
    }
    else{
      clearedAmount.push(amount[index]);
    let obj = cryptoData.find(o => o.id === cryptoNames[index]); 
    if (obj){
    clearedNames.push(obj.name);
    myPortfolio += obj.currentPrice*amount[index];
    }
    }
  });

  let generatedColors = [
    'rgb(0,104,132)',
    'rgb(176,0,81)',
    'rgb(145,39,143)',
    'rgb(255,128,128)',
    'rgb(0,102,204)',
    'rgb(153,204,0)',
    'rgb(153,51,102)'
  ];
  let generateColorsLength = generatedColors.length;
  if (clearedNames.length > generateColorsLength) {
    for (let i = 7; i < clearedNames.length; i++) {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      generatedColors.push('rgb(' + r + ',' + g + ',' + b + ')');
    }
  }

  clearedAmount.forEach((element, index) => {
    let obj = cryptoData.find(o => o.name === clearedNames[index]);
    if(obj){
    prices.push(obj.currentPrice*clearedAmount[index]);
    cryptos.push({
      title: clearedNames[index],
      value: ((obj.currentPrice*clearedAmount[index] / myPortfolio) * 100).toFixed(2) + '%',
      color: generatedColors[index],
      icon: CryptoIcons.Btc
    });
  }
  });

  const data = {
    datasets: [
      {
        data: prices,
        backgroundColor: generatedColors,
        borderWidth: 8,
        borderColor: colors.common.white,
        hoverBorderColor: colors.common.white
      }
    ],
    labels: clearedNames
  };

  const options = {
    animation: false,
    cutoutPercentage: 50,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.default,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary,
      callbacks: {
        title: function(tooltipItem, data) {
          return data['labels'][tooltipItem[0]['index']];
        },
        label: function(tooltipItem, data) {
          return (
            '$' +
            data['datasets'][0]['data'][tooltipItem['index']].toLocaleString()
          );
        }
      }
    }
  };
  return (

    <Card className={clsx(classes.root, className)} {...rest}>
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
                PORTFOLIO DIVERSITY
              </Typography>
            </Grid>
          </Grid>
        <Box height={300} position="relative">
          <Doughnut data={data} options={options} />
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          mt={2}
          style={{ flexFlow: 'wrap' }}
        >
          {cryptos.map(({ color, icon: Icon, title, value }) => (
            <Box key={title} p={1} textAlign="center">
              <Typography color="textPrimary" variant="body1">
                {title}
              </Typography>
              <Typography style={{ color }} variant="h3">
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

DoghnutGraph.propTypes = {
  className: PropTypes.string
};

export default DoghnutGraph;
