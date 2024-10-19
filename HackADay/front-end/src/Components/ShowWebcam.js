import React, { useRef, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { StyledButton } from '../LoginStyledElements';

//prop function to handle the blob
const ShowWebcam = ({handleBlob}) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isStreaming, setIsStreaming] = useState(false);

    //code responsible for starting the webcam stream
    useEffect(() => {
        // fucntion that start the webcam stream
        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setIsStreaming(true);
            } catch (err) {
                console.error("Error accessing webcam: ", err);
            }
        };

        startVideo();

        // Stop the webcam stream when the component unmounts
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const snapPhoto = () => {
        // Draw the video frame on the canvas
        if (canvasRef.current && videoRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);


            // Convert canvas to Blob
            canvasRef.current.toBlob(blob => {
                //     if (blob) {
                //         // Create a FormData object to send the image
                //         const formData = new FormData();
                //         formData.append('image', blob, 'snapshot.png');

                //         // Send the image to the API server
                //         fetch('https://your-api-server.com/upload', {
                //             method: 'POST',
                //             body: formData,
                //         })
                //         .then(response => response.json())
                //         .then(data => {
                //             console.log('Success:', data);
                //         })
                //         .catch(error => {
                //             console.error('Error:', error);
                //         });
                //     }
                // }
                handleBlob(blob, 'snapshot.png');
            }, 'image/png');
        }
    };

    return (
        <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'block', width: '100%', maxWidth: '300px', borderRadius: "20px", overflow: "hidden" }}>
                <video ref={videoRef} style={{ width: '100%' }} />
            </Box>
            <StyledButton
                variant="contained"
                color="primary"
                onClick={snapPhoto}
                disabled={!isStreaming}
                sx={{ marginTop: '20px' }}
                startIcon={<CameraAltIcon />}
            >
                Snap Photo
            </StyledButton>
            <Box>
                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </Box>
        </Box>
    );
};

export default ShowWebcam;