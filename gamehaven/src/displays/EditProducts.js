import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import CustomSnackbar from '../components/CustomSnackbar'; 
import LoadingBox from '../components/LoadingBox';
import { Container, TextField, Button, List, ListItem, Typography, FormControl, InputLabel, Input } from '@mui/material';

const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_SUCCESS':
        return { ...state, loading: false };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
      case 'UPDATE_REQUEST':
        return { ...state, loadingUpdate: true };
      case 'UPDATE_SUCCESS':
        return { ...state, loadingUpdate: false };
      case 'UPDATE_FAIL':
        return { ...state, loadingUpdate: false };
      case 'UPLOAD_REQUEST':
        return { ...state, loadingUpload: true, errorUpload: '' };
      case 'UPLOAD_SUCCESS':
        return {
          ...state,
          loadingUpload: false,
          errorUpload: '',
        };
      case 'UPLOAD_FAIL':
        return { ...state, loadingUpload: false, errorUpload: action.payload };
  
      default:
        return state;
    }
  };

export default function EditProducts() {
  // ... Same state and effect logic ...
  const navigate = useNavigate();
  const params = useParams(); // /product/:id
  const { id: productId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });
  
  // Updated state initialization
const [name, setName] = useState('');
const [slug, setSlug] = useState('');
const [price, setPrice] = useState(0);
const [imageUrl, setImageUrl] = useState('');
const [stockCount, setStockCount] = useState(0);
const [category, setCategory] = useState('');
const [consoleType, setConsoleType] = useState('');
const [description, setDescription] = useState('');

const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

useEffect(() => {
    const fetchData = async () => {
        try {
            dispatch({ type: 'FETCH_REQUEST' });
            const { data } = await axios.get(`/api/products/${productId}`);
            
            // Set the fetched data to states
            setName(data.name);
            setSlug(data.slug);
            setPrice(data.price);
            setImageUrl(data.imageUrl);
            setStockCount(data.stockCount);
            setCategory(data.category);
            setConsoleType(data.console);
            setDescription(data.description);
            
            dispatch({ type: 'FETCH_SUCCESS' });
        } catch (err) {
            dispatch({
                type: 'FETCH_FAIL',
                payload: getError(err),
            });
        }
    };
    fetchData();
}, [productId]);

const submitHandler = async (e) => {
  e.preventDefault();
  try {
    dispatch({ type: 'UPDATE_REQUEST' });
    
    await axios.put(
      `/api/products/${productId}`,
      {
        _id: productId,
        name,
        slug,
        description,
        price,
        imageUrl, 
        stockCount, 
        category,
        console: consoleType, 
      },
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    
    setSnackbarMessage('Product updated successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      dispatch({ type: 'UPDATE_SUCCESS' });
      navigate('/admin/product');
    } catch (err) {
      setSnackbarMessage(getError(err));
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      
      dispatch({ type: 'UPDATE_FAIL' });
    }
};

//const uploadFileHandler = async (e) => {
  //const file = e.target.files[0];
  //const bodyFormData = new FormData();
 // bodyFormData.append('file', file);
 // try {
  //  dispatch({ type: 'UPLOAD_REQUEST' });
  //  const { data } = await axios.post('/api/upload', bodyFormData, {
   //   headers: {
   //     'Content-Type': 'multipart/form-data',
    //    Authorization: `Bearer ${userInfo.token}`,
    //  },
   // });
   // dispatch({ type: 'UPLOAD_SUCCESS' });
   // setImage(data.secure_url);
   // setSnackbarMessage('Image uploaded successfully. Click Update to apply it');
   // setSnackbarSeverity('success');
   // setSnackbarOpen(true);
  //} catch (err) {
   // setSnackbarMessage(getError(err));
   // setSnackbarSeverity('error');
   // setSnackbarOpen(true);
  //  dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
  //}
//};

//const deleteFileHandler = () => {
///  setImage('');  // Resets the imageUrl
//  setSnackbarMessage('Image removed successfully. Click Update to apply it');
 // setSnackbarSeverity('success');
 // setSnackbarOpen(true);
//};


return (
  <Container>
    <Typography variant="h4" component="h1" gutterBottom>
      Edit Product {productId}
    </Typography>

    {loading ? (
      <LoadingBox />
    ) : error ? (
      <div>{error}</div>
    ) : (
      <form onSubmit={submitHandler}>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        
        <TextField
          fullWidth
          margin="normal"
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
        
        <TextField
          fullWidth
          margin="normal"
          label="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          type="number"
        />

        <TextField
          fullWidth
          margin="normal"
          label="ImageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="Stock Count"
          value={stockCount}
          onChange={(e) => setStockCount(e.target.value)}
          required
          type="number"
        />

        <TextField
          fullWidth
          margin="normal"
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="Console Type"
          value={consoleType}
          onChange={(e) => setConsoleType(e.target.value)}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          multiline
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loadingUpdate}
          sx={{ mt: 3 }}
        >
          Update
        </Button>
        {loadingUpdate && <LoadingBox />}
      </form>
    )}
  </Container>
);
}