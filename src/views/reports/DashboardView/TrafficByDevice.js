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
  CardHeader,
  Divider,
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

const TrafficByDevice = ({
  className,
  userCryptos,
  portfolioAmount,
  ...rest
}) => {
  let cryptos = [];
  const classes = useStyles();
  const theme = useTheme();
  let result = userCryptos.reduce((c, v) => {
    if (v.action == 'Sold') {
      c[v.cryptoName] =
        (c[v.cryptoName] || 0) - v.amount * v.priceAtDatePerOneCoin;
    } else {
      c[v.cryptoName] =
        (c[v.cryptoName] || 0) + v.amount * v.priceAtDatePerOneCoin;
    }
    return c;
  }, {});

  let prices = Object.values(result);
  let cryptoNames = Object.keys(result);
  cryptoNames.forEach((element, index) => {
    if (prices[index] == 0) {
      cryptoNames.splice([index], 1);
      prices.splice([index], 1);
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
  if (cryptoNames.length > generateColorsLength) {
    for (let i = 7; i < cryptoNames.length; i++) {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      generatedColors.push('rgb(' + r + ',' + g + ',' + b + ')');
    }
  }

  prices.forEach((element, index) => {
    cryptos.push({
      title: cryptoNames[index],
      value: ((element / portfolioAmount) * 100).toFixed(2) + '%',
      color: generatedColors[index],
      icon: CryptoIcons.Btc
    });
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
    labels: cryptoNames
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
      <CardHeader title="My portfolio" />
      <Divider />
      <CardContent>
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

TrafficByDevice.propTypes = {
  className: PropTypes.string
};

export default TrafficByDevice;
