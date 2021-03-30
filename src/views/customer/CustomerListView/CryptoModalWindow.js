/* eslint-disable */
import React from 'react';
import { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import { MenuItem, Select, Box, Grid } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Graph from './Graph';
import { makeStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';

const style = {
  minWidth: 90,
  textAlign: 'left'
};

export default function CryptoModalWindow({
  open,
  selectedCrypto,
  onClose,
  graph
}) {
  function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`
    };
  }

  const handleClose = () => {
    clear();
    onClose();
  };

  const clear = () => {
    setIsHidden(true);
    setAmount('');
    setDate('');
    setAction('Bought');
  };

  const handleSubmit = e => {
    clear();
    e.preventDefault();
    let cryptoId = selectedCrypto.id;
    let cryptoName = selectedCrypto.name;
    const crypto = { cryptoId, cryptoName, action, amount, date };

    fetch('http://localhost:8000/cryptoTransactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(crypto)
    }).then(() => {
      console.log('new crypto transaction added');
    });
  };

  const useStyles = makeStyles(theme => ({
    paper: {
      position: 'absolute',
      width: 900,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      outline: 'none'
    }
  }));

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [isHidden, setIsHidden] = useState(true);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [action, setAction] = useState('Bought');

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div style={modalStyle} className={classes.paper}>
        <h2>{selectedCrypto.name}</h2>
        <Box textAlign="center">
          <Graph cryptoId={selectedCrypto.id} />

          {/*         
       <Helmet>
          <script src="https://widgets.coingecko.com/coingecko-coin-compare-chart-widget.js"></script>
       </Helmet>
       <div dangerouslySetInnerHTML={{__html: '<coingecko-coin-compare-chart-widget  coin-ids="'+selectedCrypto.id+'" currency="usd" locale="en"></coingecko-coin-compare-chart-widget>'}}></div>
   */}
<Grid container spacing={0.1} justify='space-evenly'>
          <Button
            hidden={isHidden ? false : true}
            variant="contained"
            color="primary"
            onClick={() => setIsHidden(false)}
          >
            Add transaction
          </Button>

          <Button
            variant="contained"
            color="primary"
            hidden={isHidden ? false : true}
          >
            Add to favourites
          </Button>
          </Grid>

          <form
            hidden={isHidden}
            className={classes.root}
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <div>
              <TextField
                required
                id="outlined-basic"
                label="Amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                InputLabelProps={{
                  shrink: true
                }}
              />

              <TextField
                required
                id="datetime-local"
                label="Transaction time"
                type="datetime-local"
                className={classes.textField}
                value={date}
                onChange={e => setDate(e.target.value)}
                InputLabelProps={{
                  shrink: true
                }}
              />
              
              <TextField 
                style={style}
                required
                id="standard-select-currency"
                select
                label="Type"
                value={action}
                onChange={e => setAction(e.target.value)}
              >
                <MenuItem value={'Bought'}>Bought</MenuItem>
                <MenuItem value={'Sold'}>Sold</MenuItem>
              </TextField>
            </div>
            <div style={{ padding: 20 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => setIsHidden(false)}
              >
                Submit
              </Button>
            </div>
          </form>
        </Box>
      </div>
    </Modal>
  );
}
