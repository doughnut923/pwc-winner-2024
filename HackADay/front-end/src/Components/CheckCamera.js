import React from 'react';
import { Box, Typography } from '@mui/material';
import ShowWebcam from './ShowWebcam'; // Adjust the import path as necessary

const CheckCamera = ({handleBlob}) => {

    return (
        <Box
            sx={{
                position: 'absolute',
                left: '50%', // Center the box horizontally
                top: '50%', // Center the box vertically
                transform: 'translate(-50%, -50%)', // Center the box horizontally and vertically
                margin: '10px auto', // Center the box horizontally
                textAlign: 'center', // Center the text inside the box
                padding: '20px', // Add some padding
                borderRadius: '8px', // Optional: Add rounded corners
                height: '60%', // Optional: Set the height
            }}
        >
            <img 
                src="https://www.svgrepo.com/show/325179/face-id.svg" 
                alt="Face ID" 
                style={{ width: '40px', marginBottom: '0px' }} 
            />
            <Typography variant="h5" component="h1" gutterBottom>
                Setup Your Camera
            </Typography>
            <ShowWebcam message={"done"} myWidth={"100"}handleBlob={handleBlob} />
        </Box>
    );
};

export default CheckCamera;