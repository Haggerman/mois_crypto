/* eslint-disable */
import React from 'react';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import { MenuItem, Box, Grid, Card, CardContent, Typography } from '@material-ui/core';
import Graph from './Graph';
import { makeStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import { Navigate } from 'react-router';

const style = {
  minWidth: 90,
  textAlign: 'left'
};

export default function CryptoModalWindow({
  open,
  selectedCrypto,
  onClose,
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
    setAmount();
    setDate('');
    setPrice();
    setAction('Buy');
  };

  const handleSubmit = e => {
    clear();
    e.preventDefault();
    let cryptoId = selectedCrypto.id;
    let cryptoName = selectedCrypto.name;
    setAmount(parseFloat(amount));
    setPrice(parseFloat(priceAtDatePerCoin));

    fetch('http://localhost:8000/cryptoTransactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({cryptoId: cryptoId, cryptoName: cryptoName, action: action, amount: parseFloat(amount), date: date, priceAtDatePerCoin: parseFloat(priceAtDatePerCoin)})
    }).then(() => {
      handleTransaction();
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
    },
    root: {
      minWidth: 200,
      padding: 0,
      paddingBottom: 0
      
    },
    graph: {
      width: "100%",
    }
  }));

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [isHidden, setIsHidden] = useState(true);
  const [amount, setAmount] = useState(0);
  const [priceAtDatePerCoin, setPrice] = useState(0);
  const [date, setDate] = useState('');
  const [action, setAction] = useState('Buy');
 

  return (
    <div>
    { selectedCrypto && (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div style={modalStyle} className={classes.paper}>
        <h2>{selectedCrypto.name}</h2>
        <Box textAlign="center">
        
        <Grid container>  
          <Grid
            item
            lg={9}
            sm={9}
            xl={9}
            xs={12}
          >
            <Card className={classes.graph} variant="outlined">
            <CardContent>
               <Graph cryptoId={selectedCrypto.id} /> 
            </CardContent>
            </Card>         
         </Grid>
        <Grid
            item
            lg={2}
            sm={2}
            xl={2}
            xs={12}
          >
        <Card className={classes.root} variant="outlined">
            <CardContent className={classes.root}  >
              <Typography className={classes.root}>
                Current price:
              </Typography>
              <Typography>{"$ " + selectedCrypto.currentPrice.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
          <Card className={classes.root} variant="outlined">
            <CardContent className={classes.root}>
              <Typography>
                Market Cap:
              </Typography>
              <Typography>{"$ "+ selectedCrypto.marketCap.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
          <Card className={classes.root} variant="outlined">
            <CardContent className={classes.root}>
              <Typography>
                Supply:
              </Typography>
              <Typography>{(selectedCrypto.circulatingSupply).toFixed(2)+ " / "+ (selectedCrypto.totalSupply != null ? (selectedCrypto.totalSupply).toFixed(2) : "NaN")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
          </Grid>
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
                type="number"
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
                value={priceAtDatePerCoin}
                type="number"
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
                <MenuItem value={'Buy'}>Buy</MenuItem>
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
     )}
     
    </div>
  );
}
