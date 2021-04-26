/* eslint-disable */
import React from 'react';
import {
  Box,
  Card,
  Container,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import Page from 'src/components/Page';
import MyPortfolio from './MyPortfolio';
import Favorites from './Favorites';
import PortfolioGraph from './PortfolioGraph';
import BitcoinPriceCard from './BitcoinPriceCard';
import TotalProfit from './TotalProfit';
import DoghnutGraph from './DoghnutGraph';
import UserCryptosList from 'src/views/data_fetch/userCryptosList';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Dashboard = ({
  userCryptos,
  portfolioAmount,
  cryptoData,
  userFavorites,
  handleUpdate,
  handleTransaction,
  userCryptoGraphData,
  historyCrypto,
  userPorfolioMonthPrior,
  numOfCoins
}) => {
  const classes = useStyles();
  return (
    <Page className={classes.root} title="Dashboard">
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={4} sm={4} xl={4} xs={12}>
            <MyPortfolio
              portfolioAmount={portfolioAmount}
              cryptoData={cryptoData}
              userPorfolioMonthPrior={userPorfolioMonthPrior}
            />
          </Grid>
          <Grid item lg={4} sm={4} xl={4} xs={12}>
            <BitcoinPriceCard
              userCryptos={userCryptos}
              cryptoData={cryptoData}
              historyCrypto={historyCrypto}
            />
          </Grid>
          <Grid item lg={4} sm={4} xl={4} xs={12}>
            <TotalProfit
              userCryptos={userCryptos}
              portfolioAmount={portfolioAmount}
              cryptoData={cryptoData}
            />
          </Grid>
          <Grid item lg={numOfCoins > 0 ? 8 : 12 } md={12} xl={9} xs={12}>
            {userCryptos && userCryptos.length > 0 ? (
              <PortfolioGraph userCryptoGraphData={userCryptoGraphData} />
            ) : null}
          </Grid>
          
            {portfolioAmount && numOfCoins > 0 ? (
              <Grid item lg={4} md={6} xl={3} xs={12}>
              <DoghnutGraph
                userCryptos={userCryptos}
                portfolioAmount={portfolioAmount}
                cryptoData={cryptoData}
              />
              </Grid>
            ) : null}
          
          <Grid item lg={4} md={6} xl={3} xs={12}>
            {userFavorites && handleUpdate && userCryptos && cryptoData && (
              <Favorites
                userFavorites={userFavorites}
                handleUpdate={handleUpdate}
                handleTransaction={handleTransaction}
                userCryptos={userCryptos}
                cryptoData={cryptoData}
              />
            )}
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <Card>
              <Typography
                color="textSecondary"
                style={{ padding: '12px' }}
                variant="h6"
              >
                TRANSACTIONS
              </Typography>
              <Box pl={2} pr={2}>
                {cryptoData && userCryptos && (
                  <UserCryptosList
                    userCryptos={userCryptos}
                    cryptoData={cryptoData}
                  />
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
