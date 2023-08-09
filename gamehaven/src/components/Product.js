import { Card, CardContent, CardMedia, Button, Typography } from "@mui/material";
import { indigo } from '@mui/material/colors';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store.js';


function Product({ product }) {

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
    cart: { cartItems },
    } = state;

    const addToCartHandler = async (item) => {
        const existItem = cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${item._id}`);
        if (data.countInStock < quantity) {
          window.alert('Sorry. Product is out of stock');
          return;
        }
        ctxDispatch({
          type: 'CART_ADD_ITEM',
          payload: { ...item, quantity },
        });
      };
    
    return (
        <Box 
        key={product.slug} 
        sx={{ 
            maxWidth: 345, 
            padding: 2,
            backgroundColor: 'white',
            transition: '0.3s',
            boxShadow: 1,
            ':hover': {
              backgroundColor: 'lightGrey',
              boxShadow: 3,
            },
        }} 
    >
        <CardMedia
            component={RouterLink}
            to={`/product/${product.slug}`}
            sx={{ height: 320 }}
            image={product.imageUrl}
            alt={product.name}
        />
        <Box sx={{ backgroundColor: 'white' }}>
            <CardContent>
                <Typography component={RouterLink} to={`/product/${product.slug}`} variant="h5" color="text.secondary">
                    {product.name}
                </Typography>
                <Typography variant="body2">
                    ${product.price}
                </Typography>
                {product.countInStock === 0 ? (
                    <Button variant="contained" disabled>
                        Out of stock
                    </Button>
                ) : (
                    <Button variant="contained" color="primary" sx={{ bgcolor: indigo[900] }}
                    onClick={() => addToCartHandler(product)}>Add to cart</Button>
                )}
            </CardContent>
        </Box>
    </Box>
);
}

export default Product;
