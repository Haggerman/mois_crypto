/* eslint-disable */
import { useState, useEffect } from 'react';

const useFetch = (url) => {
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  useEffect(() => {
    const abortCont = new AbortController();

    fetch(url, { signal: abortCont.signal })
      .then((res) => {
        if (!res.ok) {
          throw Error('could not fetch the data from that resource');
        }
        return res.json();
      })
      .then((result) => {
        setData(result);
        setIsPending(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
        } else {
          setIsPending(false);
          setError(err.message);
        }
      });

    return () => abortCont.abort();
  },[url])

  return {data, isPending, error}
};

export default useFetch;
