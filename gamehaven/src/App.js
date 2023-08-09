import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Avatar, Stack, IconButton, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import { indigo } from '@mui/material/colors';
import logo from './images/Gamehavenlogo.jpg';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Home from './displays/Home';
import SignIn from './displays/SignIn.js';
import SignUp from './displays/SignUp.js';
import Products from './displays/Products.js';
import SingleProduct from './displays/SingleProduct.js';
import Cart from './displays/Cart.js';
import { Store } from './Store.js';
import OrderConfirm from './displays/OrderConfirm';
import MyOrders from './displays/MyOrders';
import ManageProducts from './displays/ManageProducts.js';
import EditProducts from './displays/EditProducts.js';
import ManageOrders from './displays/ManageOrders.js';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

function App() {

  const {state, dispatch: ctxDispatch} = useContext(Store);
  const{cart, userInfo} = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    window.location.href = '/signin';
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

  return (
    <BrowserRouter>
      <div>
        <AppBar position="static" sx={{ bgcolor: indigo[900] }}>
          <Toolbar>
            <Avatar component={Link} to="/" src={logo} alt="GameHaven logo" sx={{ width: 56, height: 56 }}/>
            <Box display="flex" flexDirection="column" alignItems="center" ml={2}>
            <Typography 
                variant="h3" 
                style={{
                  fontFamily: "'Chilly', cursive, sans-serif", // Replace with your preferred font
                  color: '#FFFFFF', // Change color based on your preference
                  fontSize: '2rem' // Adjust font size
                }}
              >
                GameHaven
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Button color="inherit" component={Link} to="/products" >Products</Button>
            <IconButton color="inherit" component={Link} to="/cart">
            <Badge 
            badgeContent={state.cart.cartItems.reduce((acc, currItem) => acc + currItem.quantity, 0)} 
            color="secondary">
            <ShoppingCartIcon />
        </Badge>
            </IconButton>
            {userInfo ? (
                <>
                {userInfo.isAdmin ? (
                  <>
                <Button color="inherit" aria-controls="admin-menu" aria-haspopup="true" onClick={handleClick}>
                            Admin Management
                        </Button>
                        <Menu
                            id="admin-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose} component={Link} to="/admin/product">Manage Products</MenuItem>
                            <MenuItem onClick={handleClose} component={Link} to="/admin/order">Manage Orders</MenuItem>
                        </Menu>
                    </>
                 ) : (
                 <Button color="inherit" component={Link} to="/myorders">My Orders</Button>
                )}

                <Button color="inherit" onClick={signoutHandler}>Sign Out</Button>
              </>
              ) : (
                <Button color="inherit" component={Link} to="/signin">Sign In</Button>
              )}
          </Toolbar>
        </AppBar>
        <main>
         <Routes>
          {/* Add a route for homescreen*/}
          <Route path='/' element={<Home/>} />
          <Route path="/product/:slug" element={<SingleProduct/>} />
          {/* May replace :slug, with the mongosee id, this is auto-generetaed*/}
           <Route path="/signin" element={<SignIn />} />
           <Route path="/signup" element={<SignUp />} />
           <Route path="/products" element={<Products/>} />
           <Route path="/cart" element={<Cart/>} />
           {/* Authorised User Routes */}
           <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderConfirm />
                  </ProtectedRoute>
                }
              ></Route>
            <Route
                path="/myorders"
                element={
                  <ProtectedRoute>
                    <MyOrders/>
                  </ProtectedRoute>
                }
              ></Route>
            {/* Admin Routes */}
            <Route
                path="/admin/product"
                element={
                  <AdminRoute>
                    <ManageProducts />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <EditProducts />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/order"
                element={
                  <AdminRoute>
                    <ManageOrders />
                  </AdminRoute>
                }
              ></Route>
         </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}


export default App;