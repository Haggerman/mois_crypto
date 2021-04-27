/* eslint-disable */
import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { useState, useEffect } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import './customCSS.css';
import CryptoListView from 'src/views/customer/CryptoListView';
import DashboardView from 'src/views/reports/DashboardView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import RegisterView from 'src/views/auth/RegisterView';
import portfolioFetch from './views/data_fetch/PortfolioFetch';
import { makeStyles } from '@material-ui/core';
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

const App = () => {
  const [ isCookiesOn, setCookies ] = useState();
  const [ isAuthenticated, setIsAuthenticated ] = useState(true);
  const { userCryptos, portfolioAmount, userFavorites, cryptoData, userCryptoGraphData, isError, historyCrypto, userPorfolioMonthPrior, numOfCoins, handleUpdate, handleTransaction, handleLogin, handleLogout } = portfolioFetch();
  const classes = useStyles();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const existingAccessToken = Cookies.get("access");
  const [authTokens, setAuthTokens] = useState(existingAccessToken);
  const [userDetails, setUserDetails] = useState(null);
  const setTokens = (data) => {    
    if(data){
      Cookies.set("access", data.accessToken);
      Cookies.set("refresh", data.refreshToken);
      setCookies(true);
      setIsAuthenticated(true);
      setAuthTokens(data.accessToken);
    }
    else{
      setIsAuthenticated(false);            
      Cookies.remove("access");    
      Cookies.remove("refresh");      
      setCookies(false); 
      setAuthTokens();
    }
  } 
  useEffect(() => {
    if(isCookiesOn){
      let accessToken = Cookies.get('access');
      fetch('https://cryptfolio.azurewebsites.net/api/User/detail', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + accessToken
        }
      })
        .then(res => {   
          if (!res.ok) {
            console.clear();
            throw Error('could not fetch the data from that resource');
          }
          return res.json();
        })
        .then(userDetail => {
          setUserDetails(userDetail);
        })
        .catch(err => {
        });
}
else {
  setUserDetails(null);
}
},[isAuthenticated, isCookiesOn])

useEffect(() => {
    let accessToken  =  Cookies.get("access");
    let refreshToken = Cookies.get("refresh"); 
    fetch('https://cryptfolio.azurewebsites.net/api/Token/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({accessToken, refreshToken})
        }).then((res) => {
          if (!res.ok) {
            setIsAuthenticated(false);    
            setCookies(false);
            Cookies.remove("access");    
            Cookies.remove("refresh");   
            console.clear();
            throw Error('Your refresh token has expired');
          }
          return res.json();
        })
        .then(data => { 
          Cookies.set("access", data.accessToken);
          Cookies.set("refresh", data.refreshToken);   
          setCookies(true);
          setIsAuthenticated(true);   
          handleLogin();
        }).catch((err) => {
          console.log(err);
        });
}, [])


if(isCookiesOn===undefined){
 return  <div></div>;
}

    return (
      <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens, isAuthenticated, isError }}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <div className={classes.root}>
          {isAuthenticated && authTokens && !isError ? <TopBar  onMobileNavOpen={() => setMobileNavOpen(true)} handleLog={handleLogout} userDetail={userDetails}/> : null }
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
                  historyCrypto={historyCrypto}
                  userPorfolioMonthPrior={userPorfolioMonthPrior}
                  numOfCoins={numOfCoins}
                />} handleLogout={handleLogout} />
                <PrivateRoute path="/list" element={
                   <CryptoListView cryptoData={cryptoData} handleUpdate={handleUpdate} handleTransaction={handleTransaction} handleLogout={handleLogout} userFavorites={userFavorites} userCryptos={userCryptos} />
                   } handleLogout={handleLogout}/>
                <PrivateRoute path="*" element={
                <NotFoundView />
                } handleLogout={handleLogout} />
                <Route path="/login">
                      <LoginView handleLogin={handleLogin} />
                </Route>
                <Route path="/register">
                      <RegisterView />
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
