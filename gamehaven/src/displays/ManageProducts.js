import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../utils';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Grid, Typography } from '@mui/material';
import LoadingBox from '../components/LoadingBox';
import CustomSnackbar from '../components/CustomSnackbar';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                products: action.payload.products,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'CREATE_REQUEST':
            return { ...state, loadingCreate: true };
        case 'CREATE_SUCCESS':
            return {
                ...state,
                loadingCreate: false,
            };
        case 'CREATE_FAIL':
            return { ...state, loadingCreate: false };
        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true, successDelete: false };
        case 'DELETE_SUCCESS':
            return {
                ...state,
                loadingDelete: false,
                successDelete: true,
            };
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false, successDelete: false };
        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false };
        default:
            return state;
    }
};

export default function ManageProducts() {
    const [
        {
            loading,
            error,
            products,
            loadingCreate,
            loadingDelete,
            successDelete,
        },
        dispatch,
    ] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const navigate = useNavigate();

    const { state } = useContext(Store);
    const { userInfo } = state;

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
                const { data } = await axios.get(`/api/products/admin`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });

                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };

        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' });
        } else {
            fetchData();
        }
    }, [userInfo, successDelete]);

    const createHandler = async () => {
        if (window.confirm('Are you sure to create?')) {
            try {
                dispatch({ type: 'CREATE_REQUEST' });
                const { data } = await axios.post(
                    '/api/products',
                    {},
                    {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    }
                );
                setSnackbarMessage('Product created successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                dispatch({ type: 'CREATE_SUCCESS' });
                navigate(`/admin/product/${data.product._id}`);
            } catch (err) {
                setSnackbarMessage(getError(err));
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                dispatch({
                    type: 'CREATE_FAIL',
                });
            }
        }
    };

    const deleteHandler = async (product) => {
        if (window.confirm('Are you sure to delete?')) {
            try {
                await axios.delete(`/api/products/${product._id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                setSnackbarMessage('Product deleted successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                dispatch({ type: 'DELETE_SUCCESS' });
            } catch (err) {
                setSnackbarMessage(getError(err));
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                dispatch({
                    type: 'DELETE_FAIL',
                });
            }
        }
    };

    return (
        <div>
            <Grid container spacing={3} alignItems="center">
                <Grid item xs={6}>
                    <Typography variant="h4">Products</Typography>
                </Grid>
                <Grid item xs={6} style={{ textAlign: 'right' }}>
                    <Button variant="contained" color="primary" onClick={createHandler}>
                        Create Product
                    </Button>
                </Grid>
            </Grid>

            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>PRODUCT ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Console</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell>{product._id}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>{product.console}</TableCell>
                                    <TableCell>
                                        <Button variant="outlined" color="primary" onClick={() => navigate(`/admin/product/${product._id}`)}>
                                            Edit
                                        </Button>
                                        &nbsp;&nbsp;
                                        <Button variant="outlined" color="secondary" onClick={() => deleteHandler(product)}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            )}
            <CustomSnackbar 
                open={snackbarOpen} 
                handleClose={closeSnackbar} 
                message={snackbarMessage} 
                severity={snackbarSeverity} 
            />
        </div>
    );
}
