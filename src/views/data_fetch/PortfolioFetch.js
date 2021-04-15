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
    const handleUpdate = () => {
      setChange(change + 1);
    }
    const handleTransaction = () => {
      setTransaction(transaction + 1);
    }
    useEffect(() => {
      let accessToken  = Cookies.get("access");
      fetch('https://cryptfolio.azurewebsites.net/api/Portfolio/Graph/user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                   'authorization' : 'Bearer ' + accessToken },
      }).then(res => {
        if(res.status == 200){
            setIsError(false);
          }else{
            setIsError(true);
        }
        
        return res.json()})
    .then(userCryptoGraphData => {   
      setUserCryptoGraphData( userCryptoGraphData );
    });
    }, [change])

    useEffect(() => {
      fetch("https://cryptfolio.azurewebsites.net/api/Crypto")
        .then(res => res.json())
        .then(cryptoData => {
          setCryptoData( cryptoData );
        });
    }, [change])

    useEffect(() => {
      console.log("TRANSAKCE");
      let accessToken  = Cookies.get("access");
      fetch("https://cryptfolio.azurewebsites.net/api/Transaction/user", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                   'authorization' : 'Bearer ' + accessToken },
      }).then(res => {
          return res.json()
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
          console.log(err);
        })
  }, [transaction, cryptoData, change])

  useEffect(() => {
    console.log("ZMĚNA");
    let accessToken  = Cookies.get("access");
    fetch("https://cryptfolio.azurewebsites.net/api/FavoriteCrypto/user", {
      method: 'GET',
      headers: { 'Content-Type': 'application/json',
                 'authorization' : 'Bearer ' + accessToken },
    }).then(res => {
        return res.json()
    }).then(
        userFavorites => {
          setUserFavorites(userFavorites);
      })
}, [change])

  return {userCryptos, portfolioAmount, userFavorites, cryptoData, userCryptoGraphData, isError, handleUpdate, handleTransaction}
}

export default portfolioFetch;