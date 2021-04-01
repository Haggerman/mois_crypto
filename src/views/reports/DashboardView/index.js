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
import LatestProducts from './LatestProducts';
import Sales from './Sales';
import TasksProgress from './TasksProgress';
import TotalProfit from './TotalProfit';
import TrafficByDevice from './TrafficByDevice';
import UserCryptosList from 'src/views/data_fetch/userCryptosList';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Dashboard = ({userCryptos, portfolioAmount, cryptoData, userFavorites, handleUpdate, handleTransactions}) => {
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
            <Budget userCryptos={userCryptos} portfolioAmount={portfolioAmount} />
          </Grid>
          <Grid
            item
            lg={4}
            sm={4}
            xl={4}
            xs={12}
          >
            <TasksProgress userCryptos={userCryptos} portfolioAmount={portfolioAmount} />
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
            <Sales />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <TrafficByDevice userCryptos={userCryptos} portfolioAmount={portfolioAmount} />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <LatestProducts userFavorites={userFavorites} handleUpdate={handleUpdate} handleTransactions={handleTransactions} />
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
                <UserCryptosList userCryptos={userCryptos} />
              </Box>
            </Card>
            
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
