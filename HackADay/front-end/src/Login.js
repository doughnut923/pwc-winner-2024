import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import logo from "./logo.svg"; // Adjust the path to your logo image
import { useNavigate } from 'react-router-dom';
import{ StyledContainer, StyledCard, FormContainer, StyledForm, StyledTextField, StyledButton } from "./LoginStyledElements"



const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Email:', email);
        console.log('Password:', password);
    };

    const navigate = useNavigate();

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
                </CardContent>
            </StyledCard>
        </StyledContainer>
    );
};

export default Login;

function initializeStyledElements() {
    const StyledContainer = styled(Container)(({ theme }) => ({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundColor: theme.palette.background.default,
    }));

    const StyledCard = styled(Card)(({ theme }) => ({
        borderRadius: 40,
        padding: theme.spacing(3),
        minWidth: '240px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }));

    const FormContainer = styled(Box)(({ theme }) => ({
        width: '100%',
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
        padding: "5px 10px",
        borderRadius: 20, // Increase border radius
        width: 'fit-content', // Width to fit content
    }));

    const StyledTextField = styled(TextField)(({ theme }) => ({
        width: '100%', // Make the text field span the entire container
        '& .MuiOutlinedInput-root': {
            borderRadius: 20, // Set border radius
            fontSize: '12px', // Set text size to 12px
            padding: '10px', // Ensure padding is consistent
        },
        '& .MuiInputLabel-root': {
            fontSize: '12px', // Set label text size to 12px
        },
        '& .MuiInputBase-input': {
            padding: '5px', // Set padding to ensure text alignment
        },
        marginBottom: theme.spacing(1), // Reduce the margin-bottom for the first TextField
    }));
    return { StyledContainer, StyledCard, FormContainer, StyledForm, StyledTextField, StyledButton };
}
