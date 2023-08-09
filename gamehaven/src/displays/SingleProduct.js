import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Typography, Button, Card, CardMedia, CardContent } from '@mui/material';
import { indigo } from '@mui/material/colors';
import { Store } from '../Store';
import { getError } from '../utils';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';

const reducer = (state, action) => {
    switch (action.type) {
      case 'REFRESH_PRODUCT':
        return { ...state, product: action.payload };
        case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function SingleProduct() {
    
    const navigate = useNavigate();
    const params = useParams();
    const{slug} = params;

    const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: '',
    });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    navigate('/cart');
  };


    return(
        loading ? (
            <LoadingBox />
          ) : error ? (
            <div>{error}</div>
          ) : (
            <div>
               <Typography 
        component={Link} 
        to="/products" 
        variant="h6"
        sx={{ textDecoration: 'none', color: 'blue', marginBottom: 3 }}
      >
        *Back to products
      </Typography>
            <Card 
            sx={{ maxWidth: 800, margin: 'auto', marginTop: 5, padding: 3, backgroundColor: 'white' }}
          >
            <CardMedia
              component="img"
              height="500"
              //image ={product.imageUrl}
              image={`${process.env.PUBLIC_URL}/${product.imageUrl}`}
              alt={product.name}
            />
            <CardContent>
              <Typography variant="h3" component="div">
                {product.name}
              </Typography>
              <Typography variant="h5" color="text.secondary">
                ${product.price}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Category: {product.category}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Console: {product.console}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {product.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
              <span style={{ color: product.stockCount > 0 ? 'green' : 'red' }}>
              {product.stockCount > 0 ? "In Stock" : "Out of Stock"}
              </span>
              </Typography>
              {product.stockCount > 0 ? (
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ marginTop: 3, backgroundColor: indigo[900] }}
                  onClick={addToCartHandler}
                >
                  Add to cart
                </Button>
              ) : (
                <Button variant="contained" disabled sx={{ marginTop: 3 }}>
                  Out of stock
                </Button>
              )}
            </CardContent>
          </Card>
          </div>
        )
      )};

export default SingleProduct;