import React, { useRef, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { StyledButton } from '../Pages/LoginStyledElements';

//prop function to handle the blob
const ShowWebcam = ({handleBlob, message}) => {
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
                window.localStream = stream;

                // Listen for the loadeddata event before playing the video
                videoRef.current.addEventListener('loadeddata', () => {
                    videoRef.current.play();
                    setIsStreaming(true);
                });
            } catch (err) {
                console.error("Error accessing webcam: ", err);
            }
        };

        startVideo();

        // Stop the webcam stream when the component unmounts
        return () => {
            if (window.localStream) {
                window.localStream.getTracks().forEach(track => track.stop());
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
                //send the blob to the parent component
                handleBlob(blob);
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
                {message}
            </StyledButton>
            <Box>
                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </Box>
        </Box>
    );
};

export default ShowWebcam;