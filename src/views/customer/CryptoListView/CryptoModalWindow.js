/* eslint-disable */
import React from 'react';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import moment from 'moment';
import {
  MenuItem,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar
} from '@material-ui/core';
import Graph from './Graph';
import { makeStyles } from '@material-ui/core/styles';
import Cookies from 'js-cookie';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import refreshToken from 'src/views/auth/refreshToken';


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
    setAmount(0);
    setDate('');
    setPrice(0);
    setAction('Buy');
    setValidate(false);
    setPending(false);
    setClicked(false);
  };
  const handleHidden = () => {
    setPrice(selectedCrypto.currentPrice);
    setIsHidden(false);
    setDate(moment(new Date()).format('YYYY-MM-DDT00:00'));
  }
  const handleRefresh = () => {
    setAmount(parseFloat(amount));
    setPrice(parseFloat(priceAtDatePerCoin));
    setPending(true);
    fetch('https://cryptfolio.azurewebsites.net/api/Transaction/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + Cookies.get('access')
      },
      body: JSON.stringify({
        CryptoId: selectedCrypto.id,
        Action: action,
        Amount: parseFloat(amount),
        date: date,
        priceAtDatePerCoin: parseFloat(priceAtDatePerCoin)
      })
    })
      .then(res => {
        if (!res.ok) {
          throw Error('could not fetch the data from that resource');
        }
        return res.json();
      })
      .then(() => {
        handleTransaction();
        clear();
      })
      .catch(err => {
        console.log('Právě jsi byl vykryptoměnován');
      });
  
  }

  const handleSubmit = e => {
    e.preventDefault();
    const current = new Date();
    const prior = new Date().setDate(current.getDate() - 30);
    let dateForm = new Date(date).getTime();

    if (dateForm <= current.getTime() && dateForm >= prior) {
      setClicked(true);

    } else {
      setValidate(true);
    }
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
      width: '100%'
    },
    image: {
      backgroundColor: 'transparent',
      marginRight: 5
    },
    text: {
      fontWeight: 100
    },
    label: {
      fontWeight: 200
    }
  }));

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [isHidden, setIsHidden] = useState(true);
  const [amount, setAmount] = useState(0);
  const [priceAtDatePerCoin, setPrice] = useState(0);
  const [date, setDate] = useState('');
  const [action, setAction] = useState('Buy');
  const [validate, setValidate] = useState(false);
  const [isPending, setPending] = useState(false);
  const [isClicked, setClicked] = useState(false);
  const {} = refreshToken(isClicked, handleRefresh)

  return (
    <div>
      {selectedCrypto && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div style={modalStyle} className={classes.paper}>
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="space-between"
            >
              <Grid item>
                <Grid container direction="row">
                  <Grid item>
                    <Avatar
                      className={classes.image}
                      src={selectedCrypto.image}
                      style={{ display: 'block' }}
                    ></Avatar>
                  </Grid>
                  <Grid item style={{ alignSelf: 'center' }}>
                    <Typography
                      color="textPrimary"
                      className={classes.label}
                      variant="h2"
                    >
                      {selectedCrypto.name} ({selectedCrypto.symbol})
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Typography
                  color="textPrimary"
                  className={classes.text}
                  variant="h3"
                >
                  {'$' + selectedCrypto.currentPrice.toLocaleString()}
                </Typography>
                <Typography
                  style={{
                    textAlign: 'right',
                    color:
                      selectedCrypto.priceChangePercentage24H > 0
                        ? '#4eaf0a'
                        : 'red'
                  }}
                  variant="h6"
                >
                  {selectedCrypto.priceChangePercentage24H > 0 ? (
                    <ArrowUpwardIcon
                      style={{ fontSize: '1rem' }}
                      className={classes.differenceIcon}
                    />
                  ) : (
                    <ArrowDownwardIcon
                      style={{ fontSize: '1rem' }}
                      className={classes.differenceIcon}
                    />
                  )}
                  {selectedCrypto.priceChangePercentage24H.toFixed(2) + '%'}{' '}
                </Typography>
              </Grid>
            </Grid>

            <Box textAlign="center">
              <Grid container>
                <Grid item lg={9} sm={9} xl={9} xs={12}>
                  <Card
                    className={classes.graph}
                    style={{ border: 'none', boxShadow: 'none' }}
                  >
                    <CardContent>
                      <Graph cryptoId={selectedCrypto.id} />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item lg={2} sm={2} xl={2} xs={12}>
                  <Card className={classes.root} variant="outlined">
                    <CardContent
                      className={classes.root}
                      style={{ padding: '10px' }}
                    >
                      <Typography color="textSecondary" variant="h6">
                        Market cap rank
                      </Typography>
                      <Typography gutterBottom>
                        {'#' + selectedCrypto.marketCapRank}
                      </Typography>
                      <Typography color="textSecondary" variant="h6">
                        Market cap
                      </Typography>
                      <Typography gutterBottom>
                        {'$' + selectedCrypto.marketCap.toLocaleString()}
                      </Typography>
                      <Typography color="textSecondary" variant="h6">
                        Price change 24h
                      </Typography>
                      <Typography gutterBottom>
                        {'$' +
                          (
                            Math.round(selectedCrypto.priceChange24H * 100) /
                            100
                          )
                            .toFixed(3)
                            .toLocaleString()}
                      </Typography>

                      <Typography color="textSecondary" variant="h6">
                        All time high
                      </Typography>
                      {
                        <Typography noWrap gutterBottom>
                          {'$' + selectedCrypto.ath.toLocaleString()}
                        </Typography>
                      }
                      <Typography color="textSecondary" variant="h6">
                        Supply
                      </Typography>
                      <Typography gutterBottom>
                        {selectedCrypto.circulatingSupply.toFixed(2) +
                          ' / ' +
                          (selectedCrypto.totalSupply != null
                            ? selectedCrypto.totalSupply.toFixed(2)
                            : 'NaN')}{' '}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Grid container spacing={1} justify="space-evenly">
                <Button
                  hidden={isHidden ? false : true}
                  variant="contained"
                  color="primary"
                  onClick={handleHidden}
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
                    InputProps={{ inputProps: { min: 0, step:0.00001} }}
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
                    InputProps={{ inputProps: { min: 0, step:0.00001} }}
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
                    InputProps={{
                      inputProps: { min: new Date().setDate(new Date().getDate()- 30), max: new Date() }
                    }}
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
                 <Button type="submit" variant="contained" color="primary" 
                    disabled={isPending} >
                    { !isPending ? "Submit" : "Adding..." }
                  </Button>
                  {validate ? (
                    <Typography
                      style={{ padding: 20, color: 'red' }}
                      variant="h6"
                    >
                      {
                        'Date can be maximally 30 days old and not from the future'
                      }
                    </Typography>
                  ) : null}
                </div>
              </form>
            </Box>
          </div>
        </Modal>
      )}
    </div>
  );
}
