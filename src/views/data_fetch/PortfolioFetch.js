/* eslint-disable */
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const portfolioFetch = () => {
  const [userCryptos, setUserCryptos] = useState(null);
  const [userFavorites, setUserFavorites] = useState(null);
  const [userCryptoGraphData, setUserCryptoGraphData] = useState(null);
  const [portfolioAmount, setPortfolioAmount] = useState(0);
  const [cryptoData, setCryptoData] = useState(null);
  const [change, setChange] = useState(0);
  const [isError, setIsError] = useState(false);
  const [transaction, setTransaction] = useState(0);
  const [historyCrypto, setHistoryCrypto] = useState(0);
  const [userPorfolioMonthPrior, setuserPorfolioMonthPrior] = useState(0);
  const [numOfCoins, setnNumOfCoins] = useState(0);
  const [isAuth, setIsAuth] = useState(false);

  const handleLogin = () => {
    setIsAuth(true);
  };
  const handleLogout = () => {
    let accessToken = Cookies.get('access');
    let refreshToken = Cookies.get('refresh');
    fetch('https://cryptfolio.azurewebsites.net/api/Token/revoke', {
      method: 'POST',
      headers: {"Content-type": "application/json",
      authorization: 'Bearer ' + accessToken},
      body: JSON.stringify({accessToken, refreshToken})
    })
      .then(res => {
        if (!res.ok) {
          console.clear();
          throw Error('could not fetch the data from that resource');
        }        
        console.clear();
        return res.json();
      })
      .catch(err => {
      },[]);
    setIsAuth(false);
  };

  const handleUpdate = () => {
    setChange(change + 1);
  };
  const handleTransaction = () => {
    setTransaction(transaction + 1);
  };
  useEffect(() => {
    if (!isAuth) {
  
    }
  }, [isAuth]);

  useEffect(() => {
    if (isAuth) {
    fetch('https://cryptfolio.azurewebsites.net/api/HistoryPrice/bitcoin')
      .then((res) => {
        if (!res.ok) {
          throw Error('could not fetch the data from that resource');
        }
        return res.json();
      })
      .then((result) => {
        setHistoryCrypto(result.prices[0][0]);
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
        } else {
        }
      });
    }
  },[isAuth])



  useEffect(() => {
    if (isAuth) {
      let accessToken = Cookies.get('access');
      fetch('https://cryptfolio.azurewebsites.net/api/Portfolio/Graph/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + accessToken
        }
      })
        .then(res => {
          setIsError(false);
          if (!res.ok) {
            setIsError(true);
            throw Error('could not fetch the data from that resource');
          }
          return res.json();
        })
        .then(userCryptoGraphData => {
          if(userCryptoGraphData && userCryptoGraphData.portfolioStatuses.length >=180){
          setuserPorfolioMonthPrior(userCryptoGraphData.portfolioStatuses[userCryptoGraphData.portfolioStatuses.length-180][0])
          }
          setUserCryptoGraphData(userCryptoGraphData);
        })
        .catch(err => {
        });
    } else {
      setUserCryptoGraphData(null);
    }
  }, [isAuth, transaction]);

  useEffect(() => {
    if (isAuth && userFavorites) {
      let accessToken = Cookies.get('access');
      fetch('https://cryptfolio.azurewebsites.net/api/Crypto/withFavorites', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + accessToken
        }
      })
        .then(res => {
          setIsError(false);
          if (!res.ok) {
            setIsError(true);
            throw Error('could not fetch the data from that resource');
          }
          return res.json();
        })
        .then(cryptoData => {
          setCryptoData(cryptoData);
        })
        .catch(err => {
        });
    } else {
      setCryptoData(null);
    }
  }, [change, isAuth, transaction, userFavorites]);

  useEffect(() => {
    if (isAuth) {
      let accessToken = Cookies.get('access');
      fetch('https://cryptfolio.azurewebsites.net/api/Transaction/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + accessToken
        }
      })
        .then(res => {
          setIsError(false);
          if (!res.ok) {
            setIsError(true);
            throw Error('could not fetch the data from that resource');
          }
          return res.json();
        })
        .then(userCryptosData => {
          setUserCryptos(userCryptosData);
          if (cryptoData) {
            let coins = 0;
            const result = userCryptosData.reduce((c, v) => {
              if (v.action == 'Sold') {
                coins+= -v.amount;
                c[v.cryptoId] = (c[v.cryptoId] || 0) - v.amount;
              } else {
                c[v.cryptoId] = (c[v.cryptoId] || 0) + v.amount;
                coins+= v.amount;
              }
              return c;
            }, {});
            setnNumOfCoins(coins);
            let amounts = Object.values(result);
            let cryptoIDs = Object.keys(result);
            let portfolio = 0;
            cryptoIDs.forEach((element, index) => {
              let obj = cryptoData.find(o => o.id === cryptoIDs[index]);
              portfolio += obj.currentPrice * amounts[index];
            });
            setPortfolioAmount(portfolio);
          }
        })
        .catch(err => {
        });
    } else {
      setUserCryptos(null);
      setPortfolioAmount(0);
    }
  }, [transaction, cryptoData, isAuth]);

  useEffect(() => {
    if (isAuth) {
      let accessToken = Cookies.get('access');
      fetch('https://cryptfolio.azurewebsites.net/api/FavoriteCrypto/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + accessToken
        }
      })
        .then(res => {
          setIsError(false);
          if (!res.ok) {
            setIsError(true);
            throw Error('could not fetch the data from that resource');
          }
          return res.json();
        })
        .then(userFavorites => {
          setUserFavorites(userFavorites);
        })
        .catch(err => {
        });
    } else {
      setUserFavorites(null);
    }
  }, [change, isAuth, transaction]);

  return {
    userCryptos,
    portfolioAmount,
    userFavorites,
    cryptoData,
    userCryptoGraphData,
    isError,
    historyCrypto,
    userPorfolioMonthPrior,
    numOfCoins,
    handleUpdate,
    handleTransaction,
    handleLogin,
    handleLogout
  };
};

export default portfolioFetch;
