/* eslint-disable */
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';


const authAndGraphDataFetch = () => {
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);
    const [isAuth, setIsAuth] = useState(null);
    useEffect(() => {
        let accessTokenTest  = Cookies.get("access");
        fetch('https://cryptfolio.azurewebsites.net/api/Portfolio/Graph/user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                   'authorization' : 'Bearer ' + accessTokenTest },
    }).then(res => { 
        if (!res.ok) {
            throw Error('could not fetch the data from that resource');
          }
        if(res.status == 200){
        setIsAuth(true);
        }else{
        setIsAuth(false);
    }    
    console.log("mrdka");
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
  return {isAuth, error, isPending }
}

export default authAndGraphDataFetch;