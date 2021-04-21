/* eslint-disable */
import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "src/context/auth";

function PrivateRoute({ component: Component, handleLogout, ...rest }) {
  const { authTokens, isAuthenticated, isError, setAuthTokens } = useAuth();
    if(!authTokens || !isAuthenticated || isError){   
      handleLogout();
      setAuthTokens();
        return <Navigate to="/login" />
    }
  return (
    <Route
      {...rest}
      render={props =>
          <Component {...props} />
      }
    />
  );
}

export default PrivateRoute;