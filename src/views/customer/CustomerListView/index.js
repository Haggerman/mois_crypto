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

const CustomerListView = ({cryptoData}) => {
  const classes = useStyles();
  
  return (
    <Page
      className={classes.root}
      title="Crypto list"
    >
      <Container maxWidth={false}>
      <SearchableList cryptoData={cryptoData}/>
      </Container>
    </Page>
  );
};

export default CustomerListView;
