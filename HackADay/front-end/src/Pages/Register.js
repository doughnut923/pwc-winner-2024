import React, { useState } from 'react';
import { Typography, Box, CardContent } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import logo from "../logo.svg"; // Adjust the path to your logo image
import BiometricSetup from '../Components/BiometricSetup';

import { StyledContainer, StyledCard, FormContainer, StyledForm, StyledTextField, StyledButton } from "./LoginStyledElements"
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRePassword] = useState('');

    const [registerState, setRegisterState] = useState(0);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        setRegisterState(1);
    };

    const registerUser = async (imageblob) => {
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
        const result = await fetch('http://localhost:8081/user/register', {
            method: 'POST',
            body: formData,
        })

        console.log(result);

        // Check the result

        if(result.ok){
            navigate('/');
        }
    }

    //return the Register form
    return (
        <StyledContainer maxWidth="sm">
            <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                <img src={logo} alt="Logo" style={{ maxWidth: '150px' }} />
            </Box>
            <StyledCard elevation={16}>
                <CardContent>
                    {
                    //checks the state of the register, shows the corresponding form
                    !registerState ? <FormContainer>
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
                    </FormContainer> : 
                    <BiometricSetup handleBlob={registerUser} logo={logo}/>}
                </CardContent>
            </StyledCard>
        </StyledContainer>
    );
};

export default Register;