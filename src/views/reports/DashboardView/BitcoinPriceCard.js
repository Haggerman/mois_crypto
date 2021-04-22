/* eslint-disable */
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as CryptoIcons from 'react-cryptocoins';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  colors
} from '@material-ui/core';
import NumberConverter from 'src/utils/NumberConverter';

const BitcoinPriceCard = ({ className, userCryptos, cryptoData, historyCrypto, ...rest }) => {
  const [percentChange, setPercentChange] = useState(0);
  const [bitcoinPrice, setBitcoinPrice] = useState(0);
  const useStyles = makeStyles((theme) => ({
    root: {
      height: '100%'
    },
    avatar: {
      backgroundColor: colors.orange[600],
      height: 56,
      width: 56
    },
    differenceIcon: {
      color: percentChange < 0 ? colors.red[600] : colors.green[600]
    },
    differenceValue: {
      color: percentChange < 0 ? colors.red[600] : colors.green[600],
      marginRight: theme.spacing(1)
    }
  }));
  const classes = useStyles();

  useEffect(() => {
  let bitcoinPrice = "Loading...";
  
  if(userCryptos && cryptoData && historyCrypto){
  const bitcoin = cryptoData.find(o => o.id === "bitcoin");  
  setBitcoinPrice(bitcoin.currentPrice)
  setPercentChange(((bitcoin.currentPrice-historyCrypto) / historyCrypto)*100)
  }
}, [cryptoData]);
  return (
    <Card
    className={clsx(classes.root, className)}
    {...rest}
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
              BITCOIN PRICE
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {bitcoinPrice != null ? <NumberConverter number={bitcoinPrice} /> : "$0"}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <CryptoIcons.Btc />
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
            Since last month
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

BitcoinPriceCard.propTypes = {
  className: PropTypes.string
};

export default BitcoinPriceCard;
