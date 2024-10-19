import React, { useRef, useEffect, useState } from 'react';

const ShowWebcam = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isStreaming, setIsStreaming] = useState(false);

    useEffect(() => {
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

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const snapPhoto = () => {
        if (canvasRef.current && videoRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };

    return (
        <div>
            <div>
                <video ref={videoRef} style={{ width: '100%' }} />
            </div>
            <button onClick={snapPhoto} disabled={!isStreaming}>Snap Photo</button>
            <div>
                <canvas ref={canvasRef} style={{ display: 'block', marginTop: '10px' }} />
            </div>
        </div>
    );
};

export default ShowWebcam;