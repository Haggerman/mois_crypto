/* eslint-disable */
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';


const authAndGraphDataFetch = () => {
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);
    const [isAuth, setAuth] = useState(true);

    useEffect(() => {
        let accessToken  = Cookies.get("access");
        fetch('https://cryptfolio.azurewebsites.net/api/Portfolio/User/detail', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                   'authorization' : 'Bearer ' + accessToken },
    }).then(res => { 
      setAuth(true);
        if (!res.ok) {   
          setAuth(false);
            throw Error('could not fetch the data from that resource');    
        }    
        
        setIsPending(false);
    }).catch((err) => {
        if (err.name === 'AbortError') {
        } else {
          setIsPending(false);
          setError(err.message);
        }
      })
    }, [])
  return { error, isPending, isAuth }
}

export default authAndGraphDataFetch;