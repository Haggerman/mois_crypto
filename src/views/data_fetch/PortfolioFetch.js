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
      console.log("TRANSAKCE");
      fetch("http://localhost:8000/cryptoTransactions").then(res => {
          return res.json()
      }).then(
          userCryptosData => {
            setUserCryptos(userCryptosData);
            let portfolio = 0;
            userCryptosData.forEach(item => {
              if (item.action == 'Sold') {
                portfolio =
                portfolio - item.amount * item.pricePerUnit;
              } else {
                portfolio =
                  item.amount * item.pricePerUnit + portfolio;
              }
            });
            setPortfolioAmount(portfolio);
        })
  }, [transaction])

  useEffect(() => {
    console.log("ZMĚNA");
    fetch("http://localhost:8000/favorites").then(res => {
        return res.json()
    }).then(
        userFavorites => {
          setUserFavorites(userFavorites);
      })
}, [change])

useEffect(() => {
  fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=&page=1&sparkline=false&price_change_percentage=24h")
    .then(res => res.json())
    .then(cryptoData => {
      setCryptoData( cryptoData );
    });
}, [])

  return {userCryptos, portfolioAmount, userFavorites, cryptoData, handleUpdate, handleTransaction}
}

export default portfolioFetch;