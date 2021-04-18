/* eslint-disable */
import Cookies from 'js-cookie';

const TokenRefresher = () => {

  const intervalId = setInterval(() => {
    let accessToken  =  Cookies.get("access");
    let refreshToken = Cookies.get("refresh"); 
    fetch('https://cryptfolio.azurewebsites.net/api/Token/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
                 'authorization' : 'Bearer ' + accessToken },
      body: JSON.stringify({accessToken, refreshToken})
        }).then(res => res.json())
        .then(data => {
          Cookies.remove("access");    
          Cookies.remove("refresh");   
          Cookies.set("access", data.accessToken);
          Cookies.set("refresh", data.refreshToken);      
        });
  }, 5000)
  return () => clearInterval(intervalId);
}

export default TokenRefresher;


