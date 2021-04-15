/* eslint-disable */
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Cookies from "js-cookie";
import { useAuth } from "src/context/auth";


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const LoginView = ({handleUpdate, authenticated}) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [Username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const { isAuthenticated ,setAuthTokens } = useAuth();

  const handleSubmit = (e) => {
    //Aby se stranka nerefreshla pri kliknuti na Add
    e.preventDefault();
    const user = {Username, password};
    fetch('https://cryptfolio.azurewebsites.net/api/Auth/login', {
        method:'POST',
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(user)
    }).then(res => res.json())
    .then(data => {
        const accessToken  = data.accessToken;
        const refreshToken = data.refreshToken;
        Cookies.set("access", accessToken);
        Cookies.set("refresh", refreshToken);
        setAuthTokens(data);
        handleUpdate();
        navigate('/', { replace: true });
    });
   
}
  if(isAuthenticated){
    navigate('/', { replace: true });
  }
  
  return (
    <Page
      className={classes.root}
      title="Login"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              userName: Username,
              password: password
            }}
            validationSchema={Yup.object().shape({
              userName: Yup.string().max(255),
              password: Yup.string().max(255)
            })}
            onSubmit={() => {
              handleSubmit();              
            }}
          >
            {({
              errors,
              handleBlur,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Sign in
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.userName && errors.userName)}
                  fullWidth
                  helperText={touched.userName && errors.userName}
                  label="User name"
                  margin="normal"
                  name="userName"
                  onBlur={handleBlur}
                  type="text"
                  value={Username} onChange={(e) => setUserName(e.target.value)}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  type="password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                />
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign in now
                  </Button>
                </Box>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Don&apos;t have an account?
                  {' '}
                  <Link
                    component={RouterLink}
                    to="/register"
                    variant="h6"
                  >
                    Sign up
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
