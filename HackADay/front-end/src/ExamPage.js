import React from 'react';
import { useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import { useTheme, ThemeProvider } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import CheckCamera from './Components/CheckCamera';
import WaitingPage from './Components/WaitingPage';
import Question from './Components/Question';

const ExamPage = () => {

    //data from the previous page
    const location = useLocation();
    const { examID } = location.state || {};

    //3 states to manage the UI:
    // 1. camera    : setup the camera
    // 2. wait      : wait for exam to start
    // 3. Question  : display the questions
    const [UIState, setUIState] = React.useState("camera");

    //state to store the exam details
    const [examDetails, setExamDetails] = React.useState({
        examName: "COMP 1000",
        examTime: "1000",
        examQuestions: [
            {
                question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
                options: ["Option 1", "Option 2", "Option 3", "Option 4"],
            }
        ]
    });

    const DB = {
        "test": {
            examName: "COMP 1000 - Introduction to Computer Science",
            examTime: "1000",
            examQuestions: [
                {
                    question: "Question",
                    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
                }
            ]
        }
    }
    // {
    //examDetails should be an object with the following properties
    // {
    // examName: "",
    // examTime: "EST 1000",
    // examQuestions: [
    //     {
    //         question: "Question",
    //         options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    //     }
    // }
    // }

    //checks whether camera have a person
    const EnsureCamera = () => {
        setUIState("wait");
    }

    const startExam = () => {
        setUIState("Question");
    }


    useEffect(() => {
        //fetch the exam details
        const data = DB["test"];
        console.log(data);
        setExamDetails(data);
        // const data = await fetch(`https://api.example.com/exam/${examID}`);
    },
        []
    )

    const theme = useTheme();

    //render corresponding UI based on the UIState
    if(UIState === "camera"){
        return (
            <>
            <Box
                sx={{
                    backgroundColor: theme.palette.background.default,
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: 10,
                        height: '90vh',
                        width: '90vw',
                    }}
                >
                    <CheckCamera handleBlob={EnsureCamera}></CheckCamera>
                </Paper>
            </Box></>
        );
    }

    else if(UIState =="wait"){
        return (
            <>
            <>
            <Box
                sx={{
                    backgroundColor: theme.palette.background.default,
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: 10,
                        height: '90vh',
                        width: '90vw',
                    }}
                >
                    <WaitingPage startExam={startExam} courseTitle={examDetails.examName} examStart={examDetails.examTime}/>
                </Paper>
            </Box></>
            </>
        );
    }else if(UIState == "Question"){
        return (
            <>
            <Box
                sx={{
                    backgroundColor: theme.palette.background.default,
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: 10,
                        height: '90vh',
                        width: '90vw',
                    }}
                >
                <Question></Question>        
                </Paper>
            </Box>
            </>
        );
    }
};

export default ExamPage;