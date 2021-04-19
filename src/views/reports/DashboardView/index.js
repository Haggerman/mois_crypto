/* eslint-disable */
import React from 'react';
import {
  Box,
  Card,
  CardHeader,
  Container,
  Divider,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Budget from './Budget';
import Favorites from './Favorites';
import PortfolioGraph from './PortfolioGraph';
import TasksProgress from './TasksProgress';
import TotalProfit from './TotalProfit';
import DoghnutGraph from './DoghnutGraph';
import UserCryptosList from 'src/views/data_fetch/userCryptosList';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Dashboard = ({userCryptos, portfolioAmount, cryptoData, userFavorites, handleUpdate, handleTransaction, userCryptoGraphData}) => {
  const classes = useStyles();
  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={4}
            sm={4}
            xl={4}
            xs={12}
          >
            <Budget userCryptos={userCryptos} portfolioAmount={portfolioAmount} cryptoData={cryptoData} />
          </Grid>
          <Grid
            item
            lg={4}
            sm={4}
            xl={4}
            xs={12}
          >
            <TasksProgress userCryptos={userCryptos} cryptoData={cryptoData} />
          </Grid>
          <Grid
            item
            lg={4}
            sm={4}
            xl={4}
            xs={12}
          >
            <TotalProfit userCryptos={userCryptos} portfolioAmount={portfolioAmount} cryptoData={cryptoData} />
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            { portfolioAmount > 0 ? <PortfolioGraph userCryptoGraphData={userCryptoGraphData} /> : null}
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            {portfolioAmount > 0 ?<DoghnutGraph userCryptos={userCryptos} portfolioAmount={portfolioAmount} cryptoData={cryptoData} /> : null }
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            {userFavorites && handleUpdate && userCryptos && cryptoData && <Favorites userFavorites={userFavorites} handleUpdate={handleUpdate} handleTransaction={handleTransaction} userCryptos={userCryptos} cryptoData={cryptoData} />}
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <Card>
            <CardHeader
              title="Latest transactions"
           />
           <Divider />
              <Box p={2}>
                {cryptoData && userCryptos && <UserCryptosList userCryptos={userCryptos} cryptoData={cryptoData} />}
              </Box>
            </Card>
            
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
