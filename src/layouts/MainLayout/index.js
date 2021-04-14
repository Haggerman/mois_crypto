/* eslint-disable */
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import LoginView from 'src/views/auth/LoginView';
import TopBar from './TopBar';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  }
}));

const MainLayout = ({handleUpdate}) => {
  const classes = useStyles();

  return (
    <Router>
      <div className={classes.root}>
        <TopBar />
          <div className={classes.wrapper}>
          <div className={classes.contentContainer}>
            <div className={classes.content}>
              <Routes>
                <Route path="/">
                  <LoginView handleUpdate={handleUpdate} />
                </Route>
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default MainLayout;
