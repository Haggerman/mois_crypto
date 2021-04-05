/* eslint-disable */
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as CryptoIcons from 'react-cryptocoins';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
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
    color: colors.green[600]
  },
  differenceValue: {
    color: colors.green[600],
    marginRight: theme.spacing(1)
  }
}));

const TasksProgress = ({ className, userCryptos, cryptoData, ...rest }) => {
  const classes = useStyles();
  const bitcoin = cryptoData.find(o => o.id === "bitcoin");
  const bitcoinPrice = bitcoin.current_price;
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
              ${bitcoinPrice.toLocaleString()}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <CryptoIcons.Btc />
            </Avatar>
          </Grid>
        </Grid>
        <Box
          mt={3}
          display="flex"
          alignItems="center"
        >
          <ArrowUpwardIcon className={classes.differenceIcon} />
          <Typography
            className={classes.differenceValue}
            variant="body2"
          >
            21.73%
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

TasksProgress.propTypes = {
  className: PropTypes.string
};

export default TasksProgress;
