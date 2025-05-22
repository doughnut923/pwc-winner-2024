import React, { useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckCamera from '../Components/CheckCamera';
import WaitingPage from '../Components/WaitingPage';
import Question from '../Components/Question';
import logo from "../logo.svg"; // Adjust the path to your logo image
import { API_BASE_URL } from '../config'; // Import the API base URL

const ExamPage = () => {

    //data from the previous page
    const location = useLocation();
    const { examName } = location.state || {};

    // fetch exam details (end time and start time)
    const examInfo = async () => {
        const token = localStorage.getItem('token');
        let resp = await fetch(`${API_BASE_URL}/exam/examContent/${examName}`, { // Use API_BASE_URL
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        let contentData = await resp.json();

        console.log("Data : " + JSON.stringify(contentData));
        if (contentData.content === null) {
            return;
        }
        // console.log(contentData);
        localStorage.setItem('examStartTime', Date.parse(contentData.startingTime));
        localStorage.setItem('examEndTime', Date.parse(contentData.endingTime));
        localStorage.setItem('examName', examName);
        initExamDetails();
    }

    // const examName = "Computer Science";
    // const examStartTime = Date.now() + 10000;
    // const examEndTime = Date.now() + 100000;

    const navigate = useNavigate();

    //3 states to manage the UI:
    // 1. camera    : setup the camera
    // 2. wait      : wait for exam to start
    // 3. Question  : display the questions
    const [UIState, setUIState] = React.useState("camera");

    //state to store the exam details
    const [examDetails, setExamDetails] = React.useState(
        {
            examName: "",
            examTime: "",
            examEndTime: "",
            examQuestions: []
        }
    );

    const getExamQuestions = async () => {
        // Fetch the exam details
        const response = await fetch(`${API_BASE_URL}/exam/examContent/${examName}`, { // Use API_BASE_URL
            method: "GET",
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            }
        });

        if (response.ok) {
            const data = await response.json();

            if (data.content === null) {
                navigate("/student-exam-option")
            }

            console.log("Name " + data.classname);
            console.log("Start Time " + data.startingTime);
            console.log("End Time " + data.endingTime);
            console.log(JSON.parse(data.content));

            const temp = examDetails;
            temp.examName = data.classname;
            temp.examTime = data.startingTime;
            temp.examEndTime = data.endingTime;
            temp.examQuestions = JSON.parse(data.content);
            setExamDetails(temp);
        }


        return;

        // const data = DB["test"];
        // console.log(data);
        // setExamDetails(data);
    }

    //checks whether camera have a person
    const EnsureCamera = () => {
        setUIState("wait");
    }

    const startExam = async () => {
        await getExamQuestions();
        setUIState("Question");
    }

    const initExamDetails = () => {

        if (localStorage.getItem("examName") === null || localStorage.getItem("examStartTime") === null || localStorage.getItem("examEndTime") === null) {
            navigate('/student-exam-option');
            return;
        }

        setExamDetails({
            examName: localStorage.getItem("examName"),
            examTime: localStorage.getItem("examStartTime"),
            examEndTime: localStorage.getItem("examEndTime"),
            examQuestions: []
        });
    }

    useEffect(() => {
        examInfo();


    }, []);

    const theme = useTheme();

    //render corresponding UI based on the UIState
    if (UIState === "camera") {
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
                            borderRadius: 5,
                            height: '90vh',
                            width: '90vw',
                            position: 'relative'
                        }}
                    >
                        <Box sx={{ position: 'absolute', top: 30, left: 50 }}>
                            <img src={logo} alt="Logo" style={{ maxWidth: '150px' }} />
                        </Box>
                        <CheckCamera handleBlob={EnsureCamera}></CheckCamera>
                    </Paper>
                </Box></>
        );
    }

    else if (UIState === "wait") {
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
                            borderRadius: 5,
                            height: '90vh',
                            width: '90vw',
                            position: 'relative'
                        }}
                    >
                        <Box sx={{ position: 'absolute', top: 30, left: 50 }}>
                            <img src={logo} alt="Logo" style={{ maxWidth: '150px' }} />
                        </Box>
                        <WaitingPage startExam={startExam} courseTitle={examDetails.examName} examStart={examDetails.examTime} />
                    </Paper>
                </Box>
            </>
        );
    }

    else if (UIState === "Question") {
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
                            borderRadius: 5,
                            height: '90vh',
                            width: '90vw',
                            position: 'relative'
                        }}
                    >
                        <Box sx={{ position: 'absolute', top: 30, left: 50 }}>
                            <img src={logo} alt="Logo" style={{ maxWidth: '150px' }} />
                        </Box>
                        <Question exam={examDetails} getExamQuestions={getExamQuestions}></Question>
                    </Paper>
                </Box>
            </>
        );
    }
};

export default ExamPage;