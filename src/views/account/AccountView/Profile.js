/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Typography,
  makeStyles
} from '@material-ui/core';


const useStyles = makeStyles(() => ({
  root: {}
}));

const Profile = ({ className, userDetails, ...rest }) => {
  const classes = useStyles();

  return (
    <Box
      className={clsx(classes.root, className)}
      {...rest}
      alignItems="center"
      display="flex"
      flexDirection="column"
    >
      <Typography
        color="textPrimary"
        gutterBottom
        variant="h3"
      >
        {userDetails ? userDetails.username : "Unknown"}
      </Typography>
    </Box>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
