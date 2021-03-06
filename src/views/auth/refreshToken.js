/* eslint-disable */
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useAuth } from 'src/context/auth';
const refreshToken = (isClicked, handleRefresh) => {
  const [error, setError] = useState(false);
  let accessToken = Cookies.get('access');
  let refreshToken = Cookies.get('refresh');
  const { setAuthTokens } = useAuth();

  useEffect(() => {
    if (isClicked) {
      const abortCont = new AbortController();
      fetch('https://cryptfolio.azurewebsites.net/api/User/detail', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + accessToken
        }
      })
        .then(res => {
          if (!res.ok) {
            setError(true);
            console.clear();
            throw Error('could not fetch the data from that resource');
          }
          handleRefresh();
        })
        .catch(err => {});
      return () => abortCont.abort();
    }
  }, [isClicked]);

  useEffect(() => {
    if (error) {
      fetch('https://cryptfolio.azurewebsites.net/api/Token/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, refreshToken })
      })
        .then(res => {
          if (!res.ok) {
            Cookies.remove('access');
            Cookies.remove('refresh');
            setAuthTokens();
            throw Error('could not fetch the data from that resource');
          }
          return res.json();
        })
        .then(data => {
          Cookies.set('access', data.accessToken);
          Cookies.set('refresh', data.refreshToken);
          setError(false);
          handleRefresh();
        })
        .catch(err => {
          console.clear();});
    }
  }, [error]);

  return {};
};

export default refreshToken;
