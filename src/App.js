/* eslint-disable */
import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import './customCSS.css';
import { Navigate, Router } from 'react-router-dom';
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

const App = () => {
  const { isAuth, isPending } = authAndGraphDataFetch();
  const { userCryptos, portfolioAmount, userFavorites, cryptoData, userCryptoGraphData, handleUpdate, handleTransaction } = portfolioFetch();
  const [ authenticated, setAuthenticated ] = useState(true); 

  TokenRefresher({isPending});
  useEffect(() => {
    if(isPending == false){
      setAuthenticated(isAuth);
    }
  }, [isPending])
  const routing = authenticated ? useRoutes([
    {
      path: 'app',
      element: <DashboardLayout />,
      children: [
        { path: 'account', element: <AccountView /> },
        { path: 'list', element: <CryptoListView
         cryptoData={cryptoData} handleUpdate={handleUpdate} handleTransaction={handleTransaction}  userFavorites={userFavorites} userCryptos={userCryptos}
         /> },
        {
          path: 'dashboard',
          element: (
            <DashboardView
              userCryptos={userCryptos}
              portfolioAmount={portfolioAmount}
              cryptoData={cryptoData}
              userFavorites={userFavorites}
              handleUpdate={handleUpdate}
              handleTransaction={handleTransaction}
              userCryptoGraphData={userCryptoGraphData}
            />
          )
        },
        { path: 'settings', element: <SettingsView /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { path: 'login', element: <LoginView handleUpdate={handleUpdate} /> },
        { path: 'register', element: <RegisterView /> },
        { path: '404', element: <NotFoundView /> },
        { path: '/', element: <Navigate to="/app/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    }
  ])
  : 
  useRoutes([    
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { path: 'login', element: <LoginView handleUpdate={handleUpdate} 
         /> },
        { path: 'register', element: <RegisterView /> },
        { path: '/', element: <Navigate to="/login" /> },
        { path: '*', element: <Navigate to="/login" /> }
      ]
    }
  ]);

  if (routing) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {routing}
      </ThemeProvider>
    );
  } else {
    
    
    return (<div>Hello darkness my old friend</div>);
  }
};

export default App;
