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
  handleUpdate,
  hideFavoritesButton,
  handleTransaction
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
    setIsHiddenFavourites(false);
    setAmount();
    setDate('');
    setPrice();
    setAction('Bought');
  };

  const handleSubmit = e => {
    clear();
    e.preventDefault();
    let cryptoId = selectedCrypto.id;
    let cryptoName = selectedCrypto.name;
    setAmount(parseFloat(amount));
    setPrice(parseFloat(pricePerUnit));

    const crypto = { cryptoId, cryptoName, action, amount, date, pricePerUnit };

    fetch('http://localhost:8000/cryptoTransactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(crypto)
    }).then(() => {
      handleTransaction();
    });
  };

  const handleSubmitFavorites = e => {
    clear();
    e.preventDefault();
    let id = selectedCrypto.id;
    let name = selectedCrypto.name;
    let image = selectedCrypto.image;
    const crypto = { id, name, image };
    fetch('http://localhost:8000/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(crypto)
    }).then(() => {
      handleUpdate();
      setIsHiddenFavourites(true);
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
  const [modalStyle] = useState(getModalStyle);
  const [isHidden, setIsHidden] = useState(true);
  const [amount, setAmount] = useState(0);
  const [pricePerUnit, setPrice] = useState(0);
  const [date, setDate] = useState('');
  const [action, setAction] = useState('Bought');
  const [isHiddenFavourites, setIsHiddenFavourites] = useState(hideFavoritesButton)
 

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
          <Grid container spacing={1} justify="space-evenly">
            <Button
              hidden={isHidden ? false : true}
              variant="contained"
              color="primary"
              onClick={() => setIsHidden(false)}
            >
              Add transaction
            </Button>
            <Button
              hidden={isHiddenFavourites}
              variant="contained"
              color="primary"
              onClick={handleSubmitFavorites}
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
                className="outlined-basic"
                label="Amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                required
                className="outlined-basic"
                label="Price per unit"
                value={pricePerUnit}
                onChange={e => setPrice(e.target.value)}
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
