/* eslint-disable */
import React from 'react';
import {
  Container,
  makeStyles,
} from '@material-ui/core';
import Page from 'src/components/Page';
import SearchableList from './SearchableList';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const CryptoListView = ({cryptoData, handleUpdate, handleTransaction, userFavorites}) => {
  const classes = useStyles();
  
  return (
    <Page
      className={classes.root}
      title="Crypto list"
    >
      <Container maxWidth={false}>
      <SearchableList cryptoData={cryptoData} handleUpdate={handleUpdate} userFavorites={userFavorites} handleTransaction={handleTransaction}/>
      </Container>
    </Page>
  );
};

export default CryptoListView;
