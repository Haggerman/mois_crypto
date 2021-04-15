/* eslint-disable */
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const TokenRefresher = ({isPending}) => {

  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    console.log(isPending);
    if(isPending == false){
    const interval = setInterval(() => setTime(Date.now()), 12000);
    return () => {
      clearInterval(interval);
      console.log(time);
    };
  }
  }, [isPending]);

  if(isPending == false){
  
  let accessToken  = Cookies.get("access");
  let refreshToken = Cookies.get("refresh");

  fetch('https://cryptfolio.azurewebsites.net/api/Token/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json',
               'authorization' : 'Bearer ' + accessToken },
    body: JSON.stringify({accessToken, refreshToken})
      }).then(res => res.json())
      .then(data => {
          const accessToken  = data.accessToken;
          const refreshToken = data.refreshToken;
          Cookies.set("access", accessToken);
          Cookies.set("refresh", refreshToken);         
      });
    }
}

export default TokenRefresher;