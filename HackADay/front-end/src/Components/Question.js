import React, { useEffect, useState } from 'react';
import { Container, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Question = ({ questions, examTitle }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState(Array(questions.length).fill(null));
    const currentQuestion = questions[currentQuestionIndex];

    useEffect(() => {
        console.log(answers);
    }, [answers]);

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
                            onClick={() => alert('Exam Submitted!')}
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
        </Container>
    );
};

export default Question;