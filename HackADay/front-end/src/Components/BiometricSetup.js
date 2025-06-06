import { Box, Typography } from '@mui/material';
import React from 'react';
import MoodIcon from '@mui/icons-material/Mood';
import ShowWebcam from './ShowWebcam';


const BiometricSetup = ({ logo, handleBlob}) => {
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
                    Face ID Setup
                </Typography>
                <MoodIcon sx={{ fontSize: 30, ml: 1 }} />
            </Box>
            <ShowWebcam message={"Done"} handleBlob={handleBlob}/>
        </>
    );
};

export default BiometricSetup;