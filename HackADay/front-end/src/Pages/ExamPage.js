import React from 'react';
import { useEffect } from 'react';
import { Box, checkboxClasses, Fade, Grow, Paper } from '@mui/material';
import { useTheme, } from '@mui/material/styles';
import { redirect, useLocation, useNavigate } from 'react-router-dom';
import CheckCamera from '../Components/CheckCamera';
import WaitingPage from '../Components/WaitingPage';
import Question from '../Components/Question';
import logo from "../logo.svg"; // Adjust the path to your logo image

const ExamPage = () => {

    //data from the previous page
    const location = useLocation();
    const { examName, examStartTime, examEndTime } = location.state || {};
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

        // fetch the exam details
        const response = await fetch(`http://localhost:8081/exam/examContent/${examName}`,
            {
                method: "GET",
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                }
            }
        );

        if (response.ok) {
            const data = await response.json();

            if(data.content === null){
                navigate("/student-exam-option")
            }

            console.log(JSON.parse(data.content));

            const temp = examDetails;
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

    async function checkAuthority() {
        // const result = await fetch("http://localhost:8081/status/checkFaces", {
        //     method: 'POST',
        //     headers:{
        //         Authorization: "Bearer" + localStorage.getItem("token"),
        //     }
        // });

        if (true /*result.ok*/) {
            return true;
        }
        else {
            return false
        }

    }

    const initExamDetails = () => {

        if (examName && examStartTime && examEndTime) {
            localStorage.setItem("examName", examName);
            localStorage.setItem("examStartTime", Date.parse(examStartTime));
            localStorage.setItem("examEndTime", Date.parse(examEndTime));
        }

        if (localStorage.getItem("examName") === null) {
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
        //check if user have authority to access the page
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        //if yes, fetch the exam details
        //if not, redirect to the login page

        const haveAuthority = checkAuthority();
        if (!haveAuthority) {
            navigate('/login');
            return;
        }

        initExamDetails();
    },
        []
    )

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
    } else if (UIState === "Question") {
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
                        <Question exam={examDetails}></Question>
                    </Paper>
                </Box>
            </>
        );
    }
};

export default ExamPage;