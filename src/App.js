/* eslint-disable */
import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { useEffect, useState } from 'react';
import { useRoutes, Navigate, BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import './customCSS.css';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import AccountView from 'src/views/account/AccountView';
import CryptoListView from 'src/views/customer/CryptoListView';
import DashboardView from 'src/views/reports/DashboardView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import RegisterView from 'src/views/auth/RegisterView';
import SettingsView from 'src/views/settings/SettingsView';
import portfolioFetch from './views/data_fetch/PortfolioFetch';
import authAndGraphDataFetch from './views/data_fetch/AuthFetch';
import TokenRefresher from './views/auth/TokenRefresher';
import { makeStyles } from '@material-ui/core';
import TopBarLogin from 'src/layouts/MainLayout/TopBar';
import NavBar from 'src/layouts/DashboardLayout/NavBar';
import TopBar from 'src/layouts/DashboardLayout/TopBar';
import { AuthContext } from "./context/auth";
import PrivateRoute from './route/PrivateRoute';
import Cookies from 'js-cookie';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256
    }
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

const App = () => {
  const { isAuth, isPending } = authAndGraphDataFetch();
  const { userCryptos, portfolioAmount, userFavorites, cryptoData, userCryptoGraphData, handleUpdate, handleTransaction } = portfolioFetch();
  const classes = useStyles();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const existingAccessToken = Cookies.get("access");
  const [authTokens, setAuthTokens] = useState(existingAccessToken);
  const setTokens = (data) => {
    console.log(data);
    if(data){
    Cookies.set("access", data.accessToken);
    setAuthTokens(data.accessToken);
    }
    else{
       Cookies.remove("access");    
       Cookies.remove("remove");       
    setAuthTokens();
    }
  }
 

  TokenRefresher({isPending});

    return (
      <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <div className={classes.root}>
          {authTokens ? <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} /> : null }
            {authTokens ? <NavBar
              onMobileClose={() => setMobileNavOpen(false)}
              openMobile={isMobileNavOpen}
            /> : null }
              <div className={classes.wrapper}>
              <div className={classes.contentContainer}>
                <div className={classes.content}>
          <Routes>
            <PrivateRoute path="/" element={<DashboardView
                  userCryptos={userCryptos}
                  portfolioAmount={portfolioAmount}
                  cryptoData={cryptoData}
                  userFavorites={userFavorites}
                  handleUpdate={handleUpdate}
                  handleTransaction={handleTransaction}
                  userCryptoGraphData={userCryptoGraphData}
                />}/>
                <PrivateRoute path="/list" element={
                   <CryptoListView cryptoData={cryptoData} handleUpdate={handleUpdate} handleTransaction={handleTransaction}  userFavorites={userFavorites} userCryptos={userCryptos} />
                   }/>
                <PrivateRoute path="/settings" element={
                   <SettingsView />
                   }/>
                  <PrivateRoute path="/account" element={
                  <AccountView />
                  }/>
                <Route path="/login">
                      <LoginView handleUpdate={handleUpdate} />
                </Route>
                <Route path='*' element={<Navigate to="/" />}/>
              </Routes>
                </div>
              </div>
            </div>
          </div>
        </ThemeProvider>
      </AuthContext.Provider>
    );
};

export default App;
