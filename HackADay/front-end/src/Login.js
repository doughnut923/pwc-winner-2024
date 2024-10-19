import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
}));

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: 40,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const FormContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
}));

const StyledForm = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
}));

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    borderRadius: 10, // Increase border radius
    alignSelf: 'flex-end', // Align to the right
    width: 'fit-content', // Width to fit content
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    width: '100%', // Make the text field span the entire container
    '& .MuiOutlinedInput-root': {
        borderRadius: 15, // Set border radius
    },
}));

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <StyledContainer maxWidth="sm">
            <StyledCard elevation={16}>
                <CardContent>
                    <FormContainer>
                        <Typography component="h1" variant="h5" align="left">
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
                            />
                            <StyledButton
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Login
                            </StyledButton>
                        </StyledForm>
                    </FormContainer>
                </CardContent>
            </StyledCard>
        </StyledContainer>
    );
};

export default Login;