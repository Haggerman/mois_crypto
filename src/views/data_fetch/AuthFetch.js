/* eslint-disable */
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';


const authAndGraphDataFetch = () => {
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let accessToken  = Cookies.get("access");
        fetch('https://cryptfolio.azurewebsites.net/api/Portfolio/Graph/user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                   'authorization' : 'Bearer ' + accessToken },
    }).then(res => { 
        if (!res.ok) {     
          console.log("ssdsd");
            throw Error('could not fetch the data from that resource');    
        }    
        
        setIsPending(false);
    }).catch((err) => {
        if (err.name === 'AbortError') {
          console.log('fetch aborted');
        } else {
          setIsPending(false);
          setError(err.message);
        }
      })
    }, [])
  return { error, isPending }
}

export default authAndGraphDataFetch;