/* eslint-disable */
import {
  Button,
  Container,
  Table,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Graph from './Graph';
import SearchableList from './SearchableList';


const DataFetchView = ({ cryptoData }) => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [url, setUrl] = useState(null);
  const [selectedCrypto, setselectedCrypto] = useState();
  const fetchFromApi = (url, crypto) => {
    setUrl(url);
    console.log('updating');
    fetch(url)
      .then(res => res.json())
      .then(
        result => {
          setItems(result);
          setselectedCrypto(crypto);
          setIsLoaded(true);
        },
        error => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return (
      <Container>
        <SearchableList cryptoData={cryptoData}/>
        <Button
          onClick={() =>
            fetchFromApi(
              'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily',
              'Bitcoin'
            )
          }
          variant="contained"
        >
          Bitcoin
        </Button>
        <Button
          onClick={() =>
            fetchFromApi(
              'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=30&interval=daily',
              'Ethereum'
            )
          }
          variant="contained"
        >
          Ethereum
        </Button>
        <Button
          onClick={() =>
            fetchFromApi(
              'https://api.coingecko.com/api/v3/coins/cardano/market_chart?vs_currency=usd&days=30&interval=daily',
              'Cardano'
            )
          }
          variant="contained"
        >
          Cardano
        </Button>
      </Container>
    );
  } else {
    return (
      <Container>
        <h1>{selectedCrypto}</h1>
        <Button
          onClick={() =>
            fetchFromApi(
              'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily',
              'Bitcoin'
            )
          }
          variant="contained"
        >
          Bitcoin
        </Button>
        <Button
          onClick={() =>
            fetchFromApi(
              'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=30&interval=daily',
              'Ethereum'
            )
          }
          variant="contained"
        >
          Ethereum
        </Button>
        <Button
          onClick={() =>
            fetchFromApi(
              'https://api.coingecko.com/api/v3/coins/cardano/market_chart?vs_currency=usd&days=30&interval=daily',
              'Cardano'
            )
          }
          variant="contained"
        >
          Cardano
        </Button>
        <Graph  url={url}/>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Datum</TableCell>
              <TableCell>Cena</TableCell>
            </TableRow>
          </TableHead>
          {[items.prices].map(
            pricesArray => (
              console.log(pricesArray.length),
              pricesArray.map(priceInOneDay => (
                <TableRow>
                  <TableCell>
                    {Intl.DateTimeFormat('cz-CZ', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    }).format(priceInOneDay[0])}
                  </TableCell>
                  <TableCell>{priceInOneDay[1]} </TableCell>
                </TableRow>
              ))
            )
          )}
        </Table>
      </Container>
    );
  }
};

export default DataFetchView;
