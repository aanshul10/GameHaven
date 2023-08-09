import react from 'react';
import { useContext, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Container, List, ListItem, ListItemText, } from '@mui/material';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    Card,
    CardContent,
    Grid
  } from '@mui/material';
import LoadingBox from "../components/LoadingBox";
import { Store } from '../Store.js';
import { getError } from '../utils.js';
import axios from 'axios';

function reducer(state, action) {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true, error: '' };
      case 'FETCH_SUCCESS':
        return { ...state, loading: false, order: action.payload, error: '' };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
    
        default:
      return state;
  }
}

export default function OrderConfirm() {
    const { state } = useContext(Store);
    const { userInfo } = state;

    const params = useParams();
    const { id: orderId } = params;
    const navigate = useNavigate();

    const [{ loading, error, order}, dispatch] = useReducer(reducer, {
        loading : true,
        order: {},
        error: '',
    });

    useEffect(() => {
        const fetchOrder = async () => {
          try {
            dispatch({ type: 'FETCH_REQUEST' });
            const { data } = await axios.get(`/api/orders/${orderId}`, {
              headers: { authorization: `Bearer ${userInfo.token}` },
            });
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
          } catch (err) {
            dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
          }
        };
    
        if (!userInfo) {
          return navigate('/signin');
        }
       if (!order._id || (order._id && order._id !== orderId)) {
        fetchOrder();
       }    
}, [order, userInfo, orderId, navigate]);
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
                    Order Confirmation
                </Typography>
       <Box>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <Typography variant="h6" color="error">{error}</Typography>
      ) : (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Order ID: {order._id}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Order Status: {order.orderStatus}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Date Placed: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
<TableContainer component={Paper}>
<Table>
    <TableHead>
      <TableRow>
        <TableCell>Product</TableCell>
        <TableCell align="right">Quantity</TableCell>
        <TableCell align="right">Price</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {order.orderItems.map((item) => (
        <TableRow key={item._id}>
          <TableCell component="th" scope="row">{item.name}</TableCell>
          <TableCell align="right">{item.quantity}</TableCell>
          <TableCell align="right">{item.price}</TableCell>
        </TableRow>
      ))}
    </TableBody>
</Table>

</TableContainer>
        </Box>
      )}
    </Box>
    </Container>
  );
}
