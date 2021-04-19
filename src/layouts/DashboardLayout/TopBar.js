/* eslint-disable */
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import InputIcon from '@material-ui/icons/Input';
import Logo from 'src/components/Logo';
import { useAuth } from "src/context/auth";

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    width: 60,
    height: 60
  },
  nav: {
    color: 'white',
    fontSize: '1.2em',
    paddingLeft: '2em'
  }
}));

const TopBar = ({
  className,
  onMobileNavOpen,
  handleLog,
  ...rest
}) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { setAuthTokens } = useAuth();

  const handleLogout = () => {    
    setAuthTokens();
    handleLog();
    navigate('/login', { replace: true });
  };

  return (
    <AppBar
      className={clsx(classes.root, className)}
      elevation={0}
      {...rest}
    >
      <Toolbar>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
          <RouterLink to="/" className={classes.nav}>
                Dashboard      
          </RouterLink>
          <RouterLink to="/list" className={classes.nav}>
                Crypto List       
          </RouterLink>
        <Box flexGrow={1} />      
          <IconButton color="inherit" onClick={() => handleLogout()}>
            <InputIcon />
          </IconButton>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onMobileNavOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
};

export default TopBar;
