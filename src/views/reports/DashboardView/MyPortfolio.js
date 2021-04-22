/* eslint-disable */
import { useState, useEffect } from 'react';
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
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import NumberConverter from 'src/utils/NumberConverter';



const MyPortfolio = ({portfolioAmount, userPorfolioMonthPrior}) => {
  const [percentChange, setPercentChange] = useState(0);
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
      color: percentChange < 0 ? colors.red[600] : colors.green[600]
    },
    differenceValue: {
      color: percentChange < 0 ? colors.red[600] : colors.green[600],
      marginRight: theme.spacing(1)
    }
  }));
  const classes = useStyles();
  
  useEffect(() => {
      if (portfolioAmount && userPorfolioMonthPrior && userPorfolioMonthPrior != 0){
      setPercentChange(((portfolioAmount-userPorfolioMonthPrior) / userPorfolioMonthPrior)*100)
      }
    }, [portfolioAmount, userPorfolioMonthPrior]);
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
            <NumberConverter number={portfolioAmount} />
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
          <Typography
            className={classes.differenceValue}
            variant="body2"
          >
           {userPorfolioMonthPrior != 0 ? percentChange ? percentChange >= 0 ? <ArrowUpwardIcon className={classes.differenceIcon} /> : <ArrowDownwardIcon className={classes.differenceIcon }  /> : null : null} { userPorfolioMonthPrior !=0 ? percentChange ? percentChange.toFixed(2).toLocaleString() : 0 + '%' : null }
          </Typography>
          <Typography
            color="textSecondary"
            variant="caption"
          >
            {userPorfolioMonthPrior != 0 ? 'Since last month' : null }
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
