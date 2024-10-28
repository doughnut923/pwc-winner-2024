import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Card, CardContent, Alert, Fade, Slide, Grow } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import logo from "../logo.svg"; // Adjust the path to your logo image
import { useNavigate } from 'react-router-dom';
import { StyledContainer, StyledCard, FormContainer, StyledForm, StyledTextField, StyledButton } from "./LoginStyledElements"
import BiometricLogin from '../Components/BiometricLogin';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // The Login state either be 0 : Login with email and password
    //                     -> or 1 : Biometric Authentication
    const [loginState, setLoginState] = useState(0);

    const [showLoginAlert, setShowLoginAlert] = useState(false);

    const loginUser = async (imageblob, filename) => {
        // Create a FormData object
        const formData = new FormData();

        // Append the image blob (Common Practice)
        // formData.append('image', imageblob, filename);

        // Append the email and password as a JSON string
        const userCredentials = JSON.stringify({
            'username': username,
            'password': password,
        });

        formData.append('user', userCredentials);
        formData.append('imageFile', await imageblob);

        // Send the form data to the server using fetch
        const result = await fetch('http://localhost:8081/user/login', {
            method: 'POST',
            body: formData,
        })

        // Check the result

        if (result.ok) {

            const data = await result.json();
            console.log(data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role)
            if (data.role === "teacher") {
                navigate('/teacher-exam-option');
            } else {
                navigate('/student-exam-option');
            }
        } else {
            console.log("Login Failed");
            setShowLoginAlert(true);
            setLoginState(0);
        }


        //if successful, navigate to the classList
        // var isTeacher = true;
        // if (isTeacher) {
        //     navigate('/myclass', { state: { token: "" } });
        // } else {
        //     navigate('/myclass', { state: { token: "" } });
        // }
    }

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
            {showLoginAlert &&
                <Slide in={showLoginAlert}>
                    <Alert variant={"filled"} onClose={() => setShowLoginAlert(false)} severity={"error"} sx={{ position: 'absolute', top: 24, borderRadius: "30px", padding: "3px 10px" }}>
                        Login Failed
                    </Alert>
                </Slide>
            }
            <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                <img src={logo} alt="Logo" style={{ maxWidth: '150px' }} />
            </Box>
            <Grow in={true}>
                <StyledCard elevation={16}>
                    {/* checks the state of the login, shows the corresponding form */}
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
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                    autoFocus
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
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
                        <BiometricLogin logo={logo} loginUser={loginUser} />}
                </StyledCard>
            </Grow>
        </StyledContainer>
    );
};

export default Login;