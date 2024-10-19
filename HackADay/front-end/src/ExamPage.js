import React from 'react';
import { useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import { useTheme, ThemeProvider } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';

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
        examTime: "EST 1000",
        examQuestions: [
            {
                question: "xQuestion",
                options: ["Option 1", "Option 2", "Option 3", "Option 4"],
            }
        ]
    }); 

    const DB = {
        "test": {
            examName: "COMP 1000",
            examTime: "EST 1000",
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

    useEffect(() => {
        //fetch the exam details
        const data = DB["test"];
        console.log(data);

        // const data = await fetch(`https://api.example.com/exam/${examID}`);
    },
        []
    )

    const theme = useTheme();

    return (
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
            />
        </Box>
    );
};

export default ExamPage;