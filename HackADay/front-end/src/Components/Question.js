import React, { useEffect, useState, useRef } from 'react';
import { Container, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

const Question = ({ questions, examTitle }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState(Array(questions.length).fill(null));
    const currentQuestion = questions[currentQuestionIndex];

    const [isStreaming, setIsStreaming] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const navigate = useNavigate();

    async function sendImage(formData) {
        // try {
        //     const response = await fetch('http://localhost:5000/upload', {
        //         method: 'POST',
        //         body: formData,
        //     });
        //     const data = await response.json();
        //     console.log(data);
        // } catch (err) {
        //     console.error('Error sending image: ', err);
        // }
        console.log('Image sent');
        console.log(formData.get('image'));
    }

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
                        const formData = new FormData();
                        formData.append('image', blob, 'snapshot.png');

                        // Send the image to the API server
                        sendImage(formData);
                    }
                }, 'image/png');
            }
        }, 1000);


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
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    //changes the answer of the current question on change of the radio button
    const handleOptionChange = (event) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = event.target.value;
        setAnswers(newAnswers);
    };

    const submitExam = () => {
        alert('Exam Submitted!');
        navigate('/complete');
    }

    return (
        <Container maxWidth="sm" sx={{ width: '80%', margin: '0 auto', marginTop: '120px' }}>
            <Typography
                variant="body1"
                component="h1"
                gutterBottom
                sx={{ color: 'secondary.main', marginBottom: '0px' }}
            >
                {examTitle}
            </Typography>
            <Typography variant="h4" component="h1" gutterBottom>
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
                {
                    currentQuestionIndex === questions.length - 1 ? (
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: '20px' }}
                            onClick= {submitExam}
                        >
                            Submit Exam
                        </Button>)
                        :
                        <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        disabled={currentQuestionIndex === questions.length - 1}
                        sx={{ borderRadius: '20px' }}
                        endIcon={<ArrowForwardIcon />}
                    >
                        Next Question
                    </Button>
                }
            </Box>
            <video ref={videoRef} style={{ display: 'none' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </Container>
    );
};

export default Question;