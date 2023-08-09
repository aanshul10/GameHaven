import React from 'react';
import { useReducer, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate} from 'react-router-dom';
import {Store} from '../Store.js'
import { getError } from '../utils.js';
import CustomSnackbar from '../components/CustomSnackbar.js';
import { Container, Card, CardContent, Typography, CardMedia, Button, Box, IconButton, Grid  } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import DeleteIcon from '@mui/icons-material/Delete';

const reducer = (state, action) => {
    switch (action.type) {
      case 'CREATE_REQUEST':
        return { ...state, loading: true };
      case 'CREATE_SUCCESS':
        return { ...state, loading: false };
      case 'CREATE_FAIL':
        return { ...state, loading: false };
      default:
        return state;
    }
};

function Cart () {
    const navigate = useNavigate();

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenSnackbar(false);
      };
    
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
    cart: { cartItems } ,userInfo
     } = state;

     const placeOrderHandler = async () => {
        if (!userInfo) {
            setSnackbarMessage("Please sign in before placing order");
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }
        try {
          dispatch({ type: 'CREATE_REQUEST' });
    
          const { data } = await axios.post(
            '/api/orders',
            {
                //orderItems: cartItems,
                orderItems: cartItems,
            },
            {
              headers: {
                // here replace 'Bearer ' with your actual token
                authorization: `Bearer ${userInfo.token}` ,
              },
            }
          );
          ctxDispatch({ type: 'CART_CLEAR' });
          dispatch({ type: 'CREATE_SUCCESS' });
          localStorage.removeItem('cartItems');
          navigate(`/order/${data.order._id}`);
        } catch (err) {
          dispatch({ type: 'CREATE_FAIL' });
          setSnackbarMessage(getError(err));
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
      };

     const removeItemHandler = (item) => {
        ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
      };
    
      const totalPrice = cartItems.reduce((acc, currItem) => acc + currItem.price * currItem.quantity, 0);
      const totalItems = cartItems.reduce((acc, currItem) => acc + currItem.quantity, 0);

      return (
        <Container>
            <Typography 
                variant="h4" 
                align="center" 
                style={{
                    fontFamily: "'Chilly', cursive, sans-serif",
                    color: 'black',
                    fontSize: '2rem'
                }}
            >
                Your Cart
            </Typography>

            {cartItems.length === 0 ? (
                <Box textAlign="center" mt={3}>
                    <Typography variant="h6" gutterBottom>
                        Your cart is empty.
                    </Typography>
                    <Link to="/products" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" color="primary">
                            Return to shopping
                        </Button>
                    </Link>
                </Box>
            ) : (
                cartItems.map((item) => (
                    <Card key={item._id} style={{ margin: '20px 0' }}>
                        <CardContent>
                            <Grid container>
                                <Grid item xs={12} sm={3}>
                                    <CardMedia
                                        component="img"
                                        style={{ maxHeight: '100px', objectFit: 'contain' }}
                                        image={item.imageUrl}
                                        alt={item.name}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box ml={2}>
                                        <Typography variant="h6">{item.name}</Typography>
                                        <Typography variant="body1">Price: ${item.price}</Typography>
                                        <Typography variant="body1">Quantity: {item.quantity}</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Box display="flex" justifyContent="flex-end">
                                        <Button variant="contained" style={{ backgroundColor: '#8b0000', color: 'white' }}
                                            onClick={() => removeItemHandler(item)}
                                          >
                                            <DeleteIcon />
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                ))
            )}

            {cartItems.length > 0 && (
                <>
                    <Button variant="contained" color="primary" onClick={placeOrderHandler}>
                        Place Order
                    </Button>
                    <Box mt={3}>
                        <Card raised={true}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                                <Box display="flex" alignItems="center">
                                    <IconButton color="primary" aria-label="total items">
                                        <ShoppingCartIcon />
                                    </IconButton>
                                    <Typography variant="h6" component="span">
                                        Total Items: {totalItems}
                                    </Typography>
                                </Box>

                                <Box display="flex" alignItems="center">
                                    <IconButton color="primary" aria-label="subtotal">
                                        <PaymentIcon />
                                    </IconButton>
                                    <Typography variant="h5" component="span">
                                        Subtotal: ${totalPrice.toFixed(2)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Box>
                </>
            )}

            <CustomSnackbar
                open={openSnackbar}
                handleClose={handleSnackbarClose}
                message={snackbarMessage}
                severity={snackbarSeverity}
            />
        </Container>
    );
};

export default Cart;
