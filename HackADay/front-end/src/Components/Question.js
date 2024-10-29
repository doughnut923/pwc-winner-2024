import React, { useEffect, useState, useRef } from 'react';
import { Container, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Box, Alert } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';


// const [examDetails, setExamDetails] = React.useState(
//     {
//         examName: "",
//         examTime: "",
//         examEndTime: "",
//         examQuestions: []
//     }
// );
const Question = ({exam}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState(Array(exam.examQuestions.length).fill(null));
    const currentQuestion = exam.examQuestions[currentQuestionIndex];

    const [isStreaming, setIsStreaming] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const navigate = useNavigate();

    const [timeLeft, setTimeLeft] = useState(() => {
        const examEndTime = new Date(parseInt(exam.examEndTime)).getTime();
        const examTime = new Date(parseInt(exam.examTime)).getTime();
        return Math.floor((examEndTime - new Date()) / 1000); // Time difference in seconds
    });

    async function sendImage(blob) {

        try {

            const formData = new FormData();
            formData.append('imageFile', await blob);
            formData.append('classname', exam.examName);

            const response = await fetch('http://localhost:8081/status/checkFaces', {
                method: 'POST',
                body: formData,
                headers:{
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            if(response.ok){
                const data = await response.json();
                console.log('Status ' + data)
            }
        } catch (err) {
            console.error('Error sending image: ', err);
        }
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    submitExam();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    //formats the time
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
    };

    useEffect(() => {
        console.log(answers);
    }, [answers]);

    //snaps a photo from webcam and sends it to backend server
    useEffect(() => {

        const startVideo = async () => {

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;

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

        const intervalId = setInterval(() => {
            if (canvasRef.current && videoRef.current) {
                const context = canvasRef.current.getContext('2d');
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

                // Convert canvas to Blob
                canvasRef.current.toBlob(blob => {
                    if (blob) {
                        // Create a FormData object to send the image
                        // Send the image to the API server
                        sendImage(blob);
                    }
                }, 'image/png');
            }
        }, 1000 * 30);


        return () => clearInterval(intervalId);
    }, []);


    //changes the current question to the previous question
    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    //changes the current question to the next question
    const handleNext = () => {
        if (currentQuestionIndex < exam.examQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    //changes the answer of the current question on change of the radio button
    const handleOptionChange = (event) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = event.target.value;
        setAnswers(newAnswers);
    };

    const submitExam = async () => {
        // Send answers to the API
        // const result = await fetch('https://your-api-server.com/submit', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ answers }),
        // })
        
        if(/*result.ok*/true){
            navigate('/complete');
        }
        return;

    };

    return (
        <Container maxWidth="70%" sx={{ position:'relative', width: '80%', margin: '0 auto', marginTop: '120px' }}>
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <Typography variant="h6" component="div">
                    {formatTime(timeLeft)}
                </Typography>
            </Box>
            <Typography
                variant="body1"
                component="h1"
                gutterBottom
                sx={{ color: 'secondary.main', marginBottom: '0px' }}
            >
                {exam.examName}
            </Typography>
            <Typography variant="h4" component="h1" gutterBottom mb={"36px"}>
                Question {currentQuestionIndex + 1}
            </Typography>
            <Typography variant="body1" gutterBottom>
                {currentQuestion.question}
            </Typography>
            <FormControl component="fieldset">
                <FormLabel component="legend">Options</FormLabel>
                <RadioGroup
                    name="options"
                    value={answers[currentQuestionIndex] || ''}
                    onChange={handleOptionChange}
                >
                    {currentQuestion.options.map((option, index) => (
                        <FormControlLabel
                            key={index}
                            value={option}
                            control={<Radio />}
                            label={option}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    sx={{ borderRadius: '20px' }}
                >
                    Previous Question
                </Button>

                {currentQuestionIndex !== exam.examQuestions.length - 1 ? (

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        sx={{ borderRadius: '20px' }}
                        endIcon={<ArrowForwardIcon />}
                    >
                        Next Question
                    </Button>)
                    :
                    <Alert variant='text' sx={{padding: "1px",color:"grey", fontSize: "14px" }}>Answers Will be submitted once the exam end.</Alert>}
            </Box>
            <video ref={videoRef} style={{ display: 'none' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </Container>
    );
};

export default Question;