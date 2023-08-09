import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import { Store } from '../Store';
import { getError } from '../utils';
import CustomSnackbar from '../components/CustomSnackbar';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Container, Typography, Select, MenuItem } from '@mui/material';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderListScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success'); // or 'error'

    const closeSnackbar = () => {
        setSnackbarOpen(false);
        setSnackbarMessage('');
    };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const updateOrderStatus = async (orderId, status) => {
    try {
        const { data } = await axios.put(`/api/orders/${orderId}/status`, {
            status: status
        }, {
            headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        // Assuming you are using a reducer or setState, 
        // you may want to dispatch or set state here to reflect the change in the UI immediately.
        setSnackbarMessage('Order status updated successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);  // This is just for debugging purposes, you can remove it later.
    } catch (error) {
        setSnackbarMessage('Failed to update order status.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
    }
  }

  return (
    <Container>
     <Typography variant="h4">Orders</Typography>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ORDER ID</TableCell>
              <TableCell>USER</TableCell>
              <TableCell>DATE PLACED</TableCell>
              <TableCell>ORDER STATUS</TableCell>
              <TableCell>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.user ? order.user.username : 'DELETED USER'}</TableCell>
                <TableCell>{order.datePlaced.substring(0, 10)}</TableCell>
                <TableCell>
                <Select
                  value={order.orderStatus}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                       >
                  <MenuItem value="Processing">Processing</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <CustomSnackbar 
    open={snackbarOpen} 
    handleClose={closeSnackbar} 
    message={snackbarMessage} 
    severity={snackbarSeverity}
     />
    </Container>
  );
}
