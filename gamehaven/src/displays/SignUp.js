import React, { useContext, useEffect, useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate, Link, useLocation} from 'react-router-dom';
import { indigo } from '@mui/material/colors';
import axios from 'axios';
import { Store } from '../Store.js';
import { getError } from '../utils.js';
import CustomSnackbar from '../components/CustomSnackbar.js';

const SignUp = () => {

    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenSnackbar(false);
      };
    
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;
  
    const handleSubmit = async (e) => {
        e.preventDefault();
          if (password !== confirmpassword) {
            setSnackbarMessage('Passwords do not match');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
          }
          try {
            const { data } = await axios.post('/api/users/signup', {
              username,
              email,
              password,
            });
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect || '/', { state: { signupSuccess: true } });
          } catch (err) {
            setSnackbarMessage(getError(err));
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
          }
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
                    Sign Up
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        required
                        label="Username"
                        variant="outlined"
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
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
                    <TextField
                        fullWidth
                        required
                        type="password"
                        label="Confirm Password"
                        variant="outlined"
                        margin="normal"
                        value={confirmpassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{ bgcolor: indigo[900] }} // Set the color of the button to match your toolbar
                        margin="normal"
                    >
                        Sign Up
                    </Button>
                </form>
                <Typography variant="body1" align="center">
                    Already have an account? <Link to="/signin">Sign in here</Link>.
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


export default SignUp;
