/* eslint-disable */
import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "src/context/auth";

function PrivateRoute({ component: Component, ...rest }) {
  const { authTokens, isAuthenticated, isError } = useAuth();
    if(!authTokens || !isAuthenticated || isError){
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