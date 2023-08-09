import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import CustomSnackbar from '../components/CustomSnackbar';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { indigo } from '@mui/material/colors';
import background from '../images/background1.jpg';


const Home = () => {
    const location = useLocation();
    // Registration
    const signupSuccess = location.state?.signupSuccess;
    // Login
    const signinSuccess = location.state?.signinSuccess;

    const [openSnackbar, setOpenSnackbar] = useState(signupSuccess || signinSuccess || false);
    const [snackbarMessage, setSnackbarMessage] = useState(
        signupSuccess 
            ? 'Registration successful! Welcome to GameHaven.' 
            : signinSuccess
                ? 'Sign in was successful. Welcome back!'
                : ''
    );
    const [snackbarSeverity, setSnackbarSeverity] = useState((signupSuccess || signinSuccess) ? 'success' : 'info');

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };


    return (
        <Container style={{ maxWidth: 'none', padding: 0 }}>
                {/* Background Image Container */}
                <div style={{
            position: 'relative',
            //width: '100%',
            //minHeight: '80vh', // You can adjust this as needed
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: -1, // This ensures the image stays behind your text content
            }} />

            {/* Content inside the background image container */}
            <div style={{ color: 'white'}}> 
                {/* Hero Section */}
                <section style={{ textAlign: 'center', margin: '0 0 3rem 0' }}>
                    <Typography variant="h2" gutterBottom>
                        Welcome to GameHaven
                    </Typography>
                    <Typography variant="h6">
                        Your ultimate destination to find the perfect game.
                    </Typography>
                </section>

                {/* Call to Action */}
                <section style={{ textAlign: 'center', margin: '3rem 8rem' }}>
                    <Typography variant="h4" gutterBottom>
                        Ready to Find Your Next Game?
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Explore our vast collection or sign up to get personalized recommendations.
                    </Typography>
                    <Button component={Link} to="/products" variant="contained" size="large" sx={{ bgcolor: indigo[900] }}>
                        Explore Games
                    </Button>
                </section>
           

        {/* Showcase Section */}
        <section style={{ margin: '3rem 8rem' }}>
            <Typography variant="h4" gutterBottom>
                Top Recommendations
            </Typography>
            <Grid container spacing={3}>
                {/* Replace with game items */}
                <Grid item xs={12} md={4}>
                    <Card style={{ backgroundColor: 'black' }}>
                        <CardContent>
                            <Typography variant="h6" style={{ color: 'white' }}>Call of Duty: Modern Warfare</Typography>
                            <Typography variant="body2" style={{ color: 'white' }}>First-person shooter video game developed by Infinity Ward and published by Activision.</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card style={{ backgroundColor: 'black' }}>
                        <CardContent>
                            <Typography variant="h6" style={{ color: 'white' }}>Final Fantasy VII Remake</Typography>
                            <Typography variant="body2" style={{ color: 'white' }}>Action role-playing game developed and published by Square Enix.</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card style={{ backgroundColor: 'black' }} >
                        <CardContent>
                            <Typography variant="h6" style={{ color: 'white' }}>Halo: The Master Chief Collection</Typography>
                            <Typography variant="body2" style={{ color: 'white' }}>Compilation of first-person shooter video games in the Halo series for the Xbox One </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </section>

        {/* About Us */}
        <section style={{textAlign: 'center', margin: '3rem 8rem' }}>
                    <Typography variant="h4" gutterBottom>
                        About GameHaven
                    </Typography>
                    <Typography variant="body1">
                        At GameHaven, we believe in the magic of gaming. Our mission is to bring you closer to games that resonate with your taste, preferences, and play style. With a vast collection and recommendations based on insights, we're here to ensure you always have a game to look forward to. If you any feedback or special requests for a particular game you want us to source. Contact Us: gamehaven@org.com.
                    </Typography>
                </section>

        {/* Testimonials */}
<section style={{ margin: '3rem 8rem 0' }}>
    <Typography variant="h4" gutterBottom>
        What Gamers Say About Us
    </Typography>
    <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
            <blockquote>
                <Typography variant="body1">
                    "GameHaven has transformed the way I choose my games. I always find the perfect match!"
                </Typography>
                <Typography variant="caption">- Alex</Typography>
            </blockquote>
        </Grid>
        <Grid item xs={12} md={4}>
            <blockquote>
                <Typography variant="body1">
                    "A vast collection and excellent recommendations. GameHaven is a game-changer!"
                </Typography>
                <Typography variant="caption">- Jordan</Typography>
            </blockquote>
        </Grid>
        <Grid item xs={12} md={4}>
            <blockquote>
                <Typography variant="body1">
                    "The recommendations are spot on! I've discovered so many great games through GameHaven."
                </Typography>
                <Typography variant="caption">- Taylor</Typography>
            </blockquote>
        </Grid>
    </Grid>
</section>

        <CustomSnackbar
            open={openSnackbar}
            handleClose={handleSnackbarClose}
            message={snackbarMessage}
            severity={snackbarSeverity}
        />
         </div>
        </div>
    </Container>
);
};
export default Home;

