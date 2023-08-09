import React, { useState, useContext, useEffect } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { indigo } from '@mui/material/colors';
import { Store } from '../Store.js';
import axios from 'axios';
import { getError } from '../utils.js';
import CustomSnackbar from '../components/CustomSnackbar.js';

const SignIn = () => {

    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    const { state , dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

    const handleSubmit = async (e) => {
       e.preventDefault();
       try {
            const { data } = await axios.post('/api/users/signin', {
              email,
              password,
           });
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect || '/' , { state: { signinSuccess: true } });
         } catch (err) {
            setSnackbarMessage(getError(err));
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            
          }
        };

        const handleSnackbarClose = (event, reason) => {
            if (reason === 'clickaway') {
              return;
            }
            setOpenSnackbar(false);
          };
      
        useEffect(() => {
         if (userInfo) {
           navigate(redirect);
            }
       }, [navigate, redirect, userInfo]);

    return (
        <Container maxWidth="sm">
            <Typography 
                variant="h4" 
                align="center" 
                style={{
                    fontFamily: "'Chilly', cursive, sans-serif",
                    color: 'black',
                    fontSize: '2rem'
                }}
            >
                Sign In
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    required
                    type="email"
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    fullWidth
                    required
                    type="password"
                    label="Password"
                    variant="outlined"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    sx={{ bgcolor: indigo[900] }} // Set the color of the button to match your toolbar
                    margin="normal"
                >
                    Sign In
                </Button>
            </form>
            <Typography variant="body1" align="center">
                Don't have an account? <Link to="/signup">Sign up here</Link>.
            </Typography>
            <CustomSnackbar
                     open={openSnackbar}
                     handleClose={handleSnackbarClose}
                      message={snackbarMessage}
                     severity={snackbarSeverity}
                     />
        </Container>
    );
  }

export default SignIn;
