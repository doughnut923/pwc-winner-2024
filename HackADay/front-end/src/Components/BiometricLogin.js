import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import MoodIcon from '@mui/icons-material/Mood';
import ShowWebcam from './ShowWebcam';


const BiometricLogin = ({ logo }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Email:', email);
        console.log('Password:', password);
    };

    // Use the navigate hook to redirect the user to the signup page
    // const navigate = useNavigate();

    // Return the Biometric Authentication form
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <img src={logo} alt="Logo" style={{ maxWidth: '150px' }} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                <Typography variant='h5'>
                    Face ID Auth
                </Typography>
                <MoodIcon sx={{ fontSize: 30, ml: 1 }} />
            </Box>
            <ShowWebcam/>
        </>
    );
};

export default BiometricLogin;