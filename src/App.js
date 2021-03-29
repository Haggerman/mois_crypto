/* eslint-disable */
import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import './customCSS.css';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import AccountView from 'src/views/account/AccountView';
import CustomerListView from 'src/views/customer/CustomerListView';
import DashboardView from 'src/views/reports/DashboardView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import ProductListView from 'src/views/product/ProductListView';
import RegisterView from 'src/views/auth/RegisterView';
import SettingsView from 'src/views/settings/SettingsView';
import DataFetchView from 'src/views/data_fetch/DataFetchView';
import portfolioFetch from './views/data_fetch/PortfolioFetch';

const App = () => {
  const { userCryptos, portfolioAmount } = portfolioFetch();
  const [cryptoData, setCryptoData] = useState(null);


  useEffect(() => {
    let cryptoData = localStorage.getItem("users");

    if (cryptoData) {
      cryptoData = JSON.parse(cryptoData);
      setCryptoData(cryptoData );
    } else {
      fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=&page=1&sparkline=false&price_change_percentage=24h")
        .then(res => res.json())
        .then(cryptoData => {
          setCryptoData( cryptoData );
          localStorage.setItem("users", JSON.stringify(cryptoData));
        });
    }
}, [])


  const routing = useRoutes([
    {
      path: 'app',
      element: <DashboardLayout />,
      children: [
        { path: 'account', element: <AccountView /> },
        { path: 'customers', element: <CustomerListView /> },
        {
          path: 'dashboard',
          element: (
            <DashboardView
              userCryptos={userCryptos}
              portfolioAmount={portfolioAmount}
              cryptoData={cryptoData}
            />
          )
        },
        { path: 'products', element: <ProductListView /> },
        { path: 'settings', element: <SettingsView /> },
        { path: 'dataFetch', element: <DataFetchView cryptoData={cryptoData} /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { path: 'login', element: <LoginView /> },
        { path: 'register', element: <RegisterView /> },
        { path: '404', element: <NotFoundView /> },
        { path: '/', element: <Navigate to="/app/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    }
  ]);

  if (userCryptos && cryptoData) {
    console.log(userCryptos);
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {routing}
      </ThemeProvider>
    );
  } else {
    return null;
  }
};

export default App;
