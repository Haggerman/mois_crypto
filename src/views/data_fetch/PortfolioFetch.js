/* eslint-disable */
import { useState, useEffect } from 'react';

const portfolioFetch = () => {
    const [userCryptos, setUserCryptos] = useState(null);
    const [userFavorites, setUserFavorites] = useState(null);
    const [portfolioAmount, setPortfolioAmount] = useState(0);
    const [cryptoData, setCryptoData] = useState(null);
    const [change, setChange] = useState(0)
    const [transaction, setTransaction] = useState(0)
    const handleUpdate = () => {
      setChange(change + 1);
    }
    const handleTransaction = () => {
      setTransaction(transaction + 1);
    }

    useEffect(() => {
      fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=&page=1&sparkline=false&price_change_percentage=24h")
        .then(res => res.json())
        .then(cryptoData => {
          setCryptoData( cryptoData );
        });
    }, [])

    useEffect(() => {
      console.log("TRANSAKCE");
      fetch("http://localhost:8000/cryptoTransactions").then(res => {
          return res.json()
      }).then(
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
                portfolio += obj.current_price * amounts[index];
              });
              setPortfolioAmount(portfolio);
            }
        })
  }, [transaction, cryptoData])

  useEffect(() => {
    console.log("ZMĚNA");
    fetch("http://localhost:8000/favorites").then(res => {
        return res.json()
    }).then(
        userFavorites => {
          setUserFavorites(userFavorites);
      })
}, [change])

  return {userCryptos, portfolioAmount, userFavorites, cryptoData, handleUpdate, handleTransaction}
}

export default portfolioFetch;