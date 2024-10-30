import React, { useState } from 'react';
import { TextField,Card,  Button, Typography, Box, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import { StyledContainer } from "../ExamOptionStyledElements"
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const AddClass = () => {
    const [classname, setClassname] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [questions, setQuestions] = useState([]);

    const navigate = useNavigate()

    const addClassToServer = async () => {

        console.log(JSON.stringify({
            classname: classname,
            startingTime: startTime,
            endingTime: endTime,
            content: JSON.stringify(questions),
        }),)

        try {
            const response = await fetch("http://localhost:8081/exam/update", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    classname: classname,
                    startingTime: startTime,
                    endingTime: endTime,
                    content: JSON.stringify(questions),
                }),
            });
            if (response.ok) {
                alert('Class added successfully');
            } else {
                alert('Failed to add class');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the class');
        }
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, { content: '', options: ['', '', '', ''] }]);
    };

    const handleRemoveQuestion = (index) => {
        const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
        setQuestions(newQuestions);
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    return (
        <StyledContainer maxWidth="sm" sx={{
            overflowY: 'hidden',
            height: '100vh',
        }}>

            <Card sx={{ marginTop: "50px", padding: "2rem", borderRadius: "30px", width:"80%", backgroundColor:"white", height:"80vh", overflowY:"scroll"}}>
                {/* add a back button to return to /teacher-exam-option */}
                <Button onClick={() => navigate('/teacher-exam-option')} startIcon={<ArrowBackIosNewIcon />}>Go Back</Button>
                <Typography variant="h4" gutterBottom >
                    Add Class
                </Typography>
                <Box component="form" noValidate autoComplete="off">
                    <TextField
                        label="Classname"
                        value={classname}
                        onChange={(e) => setClassname(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Box margin="normal">
                        <Typography variant="h5">Start Time</Typography>
                        <Datetime
                            value={startTime}
                            onChange={(newValue) => setStartTime(newValue)}
                            inputProps={{ placeholder: 'Select Start Time' }}
                        />
                    </Box>
                    <Box margin="normal">
                        <Typography variant="h5">End Time</Typography>
                        <Datetime
                            value={endTime}
                            onChange={(newValue) => setEndTime(newValue)}
                            inputProps={{ placeholder: 'Select End Time' }}
                        />
                    </Box>
                    <Typography variant="h6" gutterBottom>
                        Questions
                    </Typography>
                    {questions.map((question, qIndex) => (
                        <Box key={qIndex} mb={2}>
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={11}>
                                    <TextField
                                        label={`Question ${qIndex + 1} Content`}
                                        value={question.content}
                                        onChange={(e) => handleQuestionChange(qIndex, 'content', e.target.value)}
                                        fullWidth
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <IconButton onClick={() => handleRemoveQuestion(qIndex)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                {question.options.map((option, oIndex) => (
                                    <Grid item xs={3} key={oIndex}>
                                        <TextField
                                            label={`Option ${oIndex + 1}`}
                                            value={option}
                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                            fullWidth
                                            margin="normal"
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    ))}
                    <Button variant="contained" color="primary" onClick={handleAddQuestion}>
                        Add Question
                    </Button>
                    <Button variant="contained" color="secondary" onClick={addClassToServer} style={{ marginLeft: '16px' }}>
                        Submit Class
                    </Button>
                </Box>
            </Card>
        </StyledContainer>
    );
};

export default AddClass;