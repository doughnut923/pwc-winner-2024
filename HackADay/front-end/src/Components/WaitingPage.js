import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Fade } from '@mui/material';
import { useTheme } from '@emotion/react';


//ExamStart will be in a Date format
const WaitingPage = ({startExam, examStart, courseTitle }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const difference = examStart - now;

            if (difference < 0) {
                clearInterval(timer);
                setTimeLeft('The exam has started!');
                startExam();
            } else {
                const hours = Math.floor(difference / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [examStart]);

    const theme = useTheme();

    return (
        
        <Fade in={true}>
            <Box sx={{ 
                textAlign: 'center',
                width: "100%", 
                position:"absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)", 
                }}>
                <Typography variant="h6" sx={
                    {
                        color: theme.palette.secondary.main,
                        fontWeight: 'bold'
                }}>{courseTitle}
                </Typography>
                <Typography variant="h3">The Exam Will Start Soon</Typography>
                <Typography variant="h1" sx={{
                    color: theme.palette.secondary.main,
                    fontWeight: 'bold'
                }}>{timeLeft? timeLeft : "..."}</Typography>
            </Box>
        </Fade>
    );
};

export default WaitingPage;