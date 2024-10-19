import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import logo from "./logo.svg"; // Adjust the path to your logo image
import { useNavigate } from 'react-router-dom';
import{ StyledContainer, StyledCard, FormContainer, StyledForm, StyledTextField, StyledButton } from "./LoginStyledElements"
import BiometricLogin from './Components/BiometricLogin';



const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // The Login state either be 0 : Login with email and password
    //                     -> or 1 : Biometric Authentication
    const [loginState, setLoginState] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        setLoginState(1);
    };
    

    // Use the navigate hook to redirect the user to the signup page
    const navigate = useNavigate();

    // Return the login form
    return (
        <StyledContainer maxWidth="sm">
            <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                <img src={logo} alt="Logo" style={{ maxWidth: '150px' }} />
            </Box>
            <StyledCard elevation={16}>
                //checks the state of the login, shows the corresponding form
                {!loginState ? <CardContent>
                    <FormContainer>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                            <img src={logo} alt="Logo" style={{ maxWidth: '150px' }} />
                        </Box>
                        <Typography pl="4px" component="h1" variant="h5" align="left" color='primary' sx={{ fontWeight: 600 }}>
                            Login
                        </Typography>
                        <StyledForm component="form" onSubmit={handleSubmit}>
                            <StyledTextField
                                variant="outlined"
                                margin="normal"
                                required
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <StyledTextField
                                variant="outlined"
                                margin="normal"
                                required
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                mt="4px"
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <StyledButton
                                    type="button"
                                    variant="text"
                                    color="black"
                                    onClick={() => navigate('/signup')}
                                >
                                    Sign Up
                                </StyledButton>
                                <StyledButton
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    endIcon={<ArrowForwardIcon />}
                                >
                                    Login
                                </StyledButton>
                            </Box>
                        </StyledForm>
                    </FormContainer>
                </CardContent> : 
                <BiometricLogin logo={logo}/>}
            </StyledCard>
        </StyledContainer>
    );
};

export default Login;