import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import { Store } from '../Store.js';
import { getError } from '../utils.js';
import {
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Container,
    Paper
  } from '@mui/material';


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function MyOrders() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();


  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `/api/orders/mine`,

          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);

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
              My Orders
          </Typography>
          
          {loading ? (
              <LoadingBox></LoadingBox>
          ) : error ? (
              <Typography color="error">{error}</Typography>
          ) : (
            <Paper elevation={3} style={{ marginTop: '1rem' }}>
              <Table className="table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>DATE</TableCell>
                    <TableCell>ORDER STATUS</TableCell>
                    <TableCell>DETAILS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>{order._id}</TableCell>
                      <TableCell>{order.createdAt ? order.createdAt.substring(0, 10) : 'N/A'}</TableCell>
                      <TableCell>{order.orderStatus}</TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            navigate(`/order/${order._id}`);
                          }}
                        >
                          View Order
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Container>
      );
    }