import React, { useState } from 'react';
import { Typography, Box, CardContent } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import logo from "./logo.svg"; // Adjust the path to your logo image

import { StyledContainer, StyledCard, FormContainer, StyledForm, StyledTextField, StyledButton } from "./LoginStyledElements"

const Register = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRePassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <StyledContainer maxWidth="sm">
            <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                <img src={logo} alt="Logo" style={{ maxWidth: '150px' }} />
            </Box>
            <StyledCard elevation={16}>
                <CardContent>
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
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
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
                            <StyledTextField
                                variant="outlined"
                                margin="normal"
                                required
                                name="repassword"
                                label="Re-Type Password"
                                type="password"
                                id="repassword"
                                value={repassword}
                                onChange={(e) => setRePassword(e.target.value)}
                                mt="4px"
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                <StyledButton
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    endIcon={<ArrowForwardIcon />}
                                >
                                    Sign Up
                                </StyledButton>
                            </Box>
                        </StyledForm>
                    </FormContainer>
                </CardContent>
            </StyledCard>
        </StyledContainer>
    );
};

export default Register;