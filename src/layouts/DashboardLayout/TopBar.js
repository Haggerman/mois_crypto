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
import InputIcon from '@material-ui/icons/Input';
import AssessmentIcon from '@material-ui/icons/Assessment';
import ListAltIcon from '@material-ui/icons/ListAlt';
import Logo from 'src/components/Logo';
import { useAuth } from "src/context/auth";

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    width: 60,
    height: 60
  },
  desktopOnly: {
    width: 60,
    height: 60
  },
  nav: {
    color: 'white',
    fontSize: '1.2em',
    paddingRight: '1em',
    paddingLeft: '1em',
    '&:hover': {
      color: "black",
   },
  }
}));

const TopBar = ({
  className,
  onMobileNavOpen,
  handleLog,
  userDetail,
  ...rest
}) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { setAuthTokens } = useAuth();

  const handleLogout = () => {    
    handleLog();
    setAuthTokens();
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
          <AssessmentIcon />
          <Hidden only={['xs']}>
             <span> Dashboard </span>
           </Hidden>
          </RouterLink>
          <RouterLink to="/list" className={classes.nav}>
          <ListAltIcon  />          
          <Hidden only={['xs']}>
             <span> Crypto List </span>
           </Hidden>
          </RouterLink>
          
        <Box flexGrow={1} /> 
        <Hidden only={['xs'] }>
             <span> {userDetail && userDetail.username} </span>
           </Hidden>     
          <IconButton color="inherit" onClick={() => handleLogout()} className={classes.nav}>
            <InputIcon />        
          <Hidden only={['xs']}>
             <span> Logout </span>
           </Hidden>
          </IconButton>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
};

export default TopBar;
