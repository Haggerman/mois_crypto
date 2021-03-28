/* eslint-disable */
import { useState, useEffect } from 'react';

const portfolioFetch = () => {
    const [userCryptos, setUserCryptos] = useState(null);
    const [portfolioAmount, setPortfolioAmount] = useState(0);
    useEffect(() => {
      fetch("http://localhost:8000/cryptoTransactions").then(res => {
          return res.json()
      }).then(
          userCryptosData => {
            setUserCryptos(userCryptosData);
            let portfolio = 0;
            userCryptosData.forEach(item => {
              if (item.action == 'Sold') {
                portfolio =
                portfolio - item.amount * item.priceAtDatePerOneCoin;
              } else {
                portfolio =
                  item.amount * item.priceAtDatePerOneCoin + portfolio;
              }
            });
            setPortfolioAmount(portfolio);
        })
  }, [])
  return {userCryptos, portfolioAmount}
}

export default portfolioFetch;