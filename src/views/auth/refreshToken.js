/* eslint-disable */
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
const refreshToken = (isClicked, handleRefresh) => {

        const [isPending, setIsPending] = useState(true);
        const [error, setError] = useState(false);
        const [data, setData] = useState(null);
        let accessToken  =  Cookies.get("access");
        let refreshToken = Cookies.get("refresh"); 


    useEffect(()=> {
        if(isClicked){
        const abortCont = new AbortController();
        fetch('https://cryptfolio.azurewebsites.net/api/User/detail', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',
                       'authorization' : 'Bearer ' + accessToken },
          }).then((res) => {
            if (!res.ok) {
                setError(true);
                console.log('mel bych refreshovat')
                console.log('error:' + error)
              throw Error('could not fetch the data from that resource');
            }
            setError(false);
            console.log('nemusim  refreshovat')
            console.log('error:' + error)
            handleRefresh();
            return res.json();
          }).catch((err) => {
        }); 
        return () => abortCont.abort();
    }}, [isClicked])

    useEffect(()=> {
      console.log('jsem v useEffect refresh')
        if(error){
          console.log('spoustim refresh')
          console.log('error:' + error)
            fetch('https://cryptfolio.azurewebsites.net/api/Token/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({accessToken, refreshToken})
                  }).then((res) => {
                    if (!res.ok) {
                      Cookies.remove("access");     
                      Cookies.remove("refresh");   
                       throw Error('could not fetch the data from that resource');
                    }
                    return res.json();
                  })
                  .then(data => { 
                    Cookies.set("access", data.accessToken);
                    Cookies.set("refresh", data.refreshToken);  
                    handleRefresh();    
                  }).catch((err) => {
                }); ;
    }}, [error])

    return {}
}

export default refreshToken;