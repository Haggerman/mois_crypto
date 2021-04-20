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
    const [isAuth, setIsAuth] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    
    const handleLogin = () => { 
        setIsAuth(true);
    }
    const handleLogout = () => {
      setIsAuth(false);
    }
   
    const handleUpdate = () => {
      setChange(change + 1);   
      console.log("Kakánek");
    }
    const handleTransaction = () => {
      setTransaction(transaction + 1);
    }

    useEffect(() => {
      if(isAuth){
      let accessToken  = Cookies.get("access");
      fetch('https://cryptfolio.azurewebsites.net/api/Portfolio/Graph/user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                   'authorization' : 'Bearer ' + accessToken },
      }).then((res) => {
        setIsError(false)
        if (!res.ok) {
          setIsError(true)
          throw Error('could not fetch the data from that resource');
        }
        return res.json();
      })
    .then(userCryptoGraphData => {   
      setUserCryptoGraphData( userCryptoGraphData );
    }).catch((err) => {
      console.log("Právě jsi byl vykryproměnován");
    });
  }else{
    setUserCryptoGraphData(null)
  }
    }, [ isAuth, transaction ])

    useEffect(() => {
      if(isAuth){
      let accessToken  = Cookies.get("access");
      fetch('https://cryptfolio.azurewebsites.net/api/User/detail', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                   'authorization' : 'Bearer ' + accessToken },
      }).then((res) => {
        setIsError(false)
        if (!res.ok) {
          setIsError(true)
          throw Error('could not fetch the data from that resource');
        }
        return res.json();
      })
    .then(userDetail => {   
      setUserDetails( userDetail );
    }).catch((err) => {
      console.log("Právě jsi byl vykryproměnován");
    });
  }else{
    setUserDetails(null)
  }
    }, [isAuth])

    useEffect(() => {
      if(isAuth){
      let accessToken  = Cookies.get("access");
      fetch("https://cryptfolio.azurewebsites.net/api/Crypto/withFavorites",
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                   'authorization' : 'Bearer ' + accessToken },
      }
      )
      .then((res) => {
        setIsError(false)
        if (!res.ok) {
          setIsError(true)
          throw Error('could not fetch the data from that resource');
        }
        return res.json();
      })
        .then(cryptoData => {
          setCryptoData( cryptoData );
        }).catch((err) => {
          console.log("Právě jsi byl vykryproměnován");
        });
      }else{
        setCryptoData( null );
      }
    }, [change, isAuth, transaction])

    useEffect(() => {
      if(isAuth){
      let accessToken  = Cookies.get("access");
      fetch("https://cryptfolio.azurewebsites.net/api/Transaction/user", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                   'authorization' : 'Bearer ' + accessToken },
      }).then((res) => {
        setIsError(false)
        if (!res.ok) {
          setIsError(true)
          throw Error('could not fetch the data from that resource');
        }
        return res.json();
      })
      .then(
          userCryptosData => {
            setUserCryptos(userCryptosData);
             if(cryptoData){
              const result = userCryptosData.reduce((c, v) => {
                if (v.action == 'Sold') {
                  c[v.cryptoId] = (c[v.cryptoId] || 0) - v.amount;
                } else {
                  c[v.cryptoId] = (c[v.cryptoId] || 0) + v.amount;
                }
                return c;
              }, {});
              let amounts = Object.values(result);
              let cryptoIDs = Object.keys(result);
              let portfolio=0;
              cryptoIDs.forEach((element, index) => {
                let obj = cryptoData.find(o => o.id === cryptoIDs[index]);
                portfolio += obj.currentPrice * amounts[index];
              });
              setPortfolioAmount(portfolio);
          }
        }).catch((err) => {
          console.log("Právě jsi byl vykryproměnován");
        });
      }
      else{
        setUserCryptos(null);
        setPortfolioAmount(0);
      }
  }, [transaction, cryptoData, isAuth])

  useEffect(() => {
    if(isAuth){
    let accessToken  = Cookies.get("access");
    fetch("https://cryptfolio.azurewebsites.net/api/FavoriteCrypto/user", {
      method: 'GET',
      headers: { 'Content-Type': 'application/json',
                 'authorization' : 'Bearer ' + accessToken },
    }).then((res) => {
      setIsError(false)
      if (!res.ok) {
        setIsError(true)
        throw Error('could not fetch the data from that resource');
      }
      return res.json();
    }).then(
        userFavorites => {
          setUserFavorites(userFavorites);
      }).catch((err) => {
        console.log("Právě jsi byl vykryproměnován");
      });
    }
    else{
      setUserFavorites(null);
    }
}, [change, isAuth, transaction])

  return {userCryptos, portfolioAmount, userFavorites, cryptoData, userCryptoGraphData, isError, userDetails, handleUpdate, handleTransaction, handleLogin, handleLogout}
}

export default portfolioFetch;