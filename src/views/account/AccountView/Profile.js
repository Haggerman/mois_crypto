import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  makeStyles
} from '@material-ui/core';

const user = {
  city: 'Los Angeles',
  country: 'USA',
  name: 'Ivan Novák',
  timezone: 'GTM-7'
};

const useStyles = makeStyles(() => ({
  root: {}
}));

const Profile = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
        >
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h3"
          >
            {user.name}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
          >
            {`${user.city} ${user.country}`}
          </Typography>
          <Typography
            className={classes.dateText}
            color="textSecondary"
            variant="body1"
          >
            {`${moment().format('hh:mm A')} ${user.timezone}`}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
    </Card>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
