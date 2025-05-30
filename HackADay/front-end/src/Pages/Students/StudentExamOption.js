import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import logo from "../../logo.svg";
import { StyledContainer, StyledCard, InsideContainer, CardBox } from "./StudentExamOptionStyledElements"
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config'; // Adjust the path as needed



const StudentExamOption = () => {
    const navigate = useNavigate();

    // Clear local storage from details of previous exam
    localStorage.removeItem('examName');
    localStorage.removeItem('examStartTime');
    localStorage.removeItem('examEndTime');

    // Check user role every 60 seconds
    useEffect(() => {
        const checkUserRole = () => {
            const userRole = localStorage.getItem('role');
            if (userRole === "teacher") {
                navigate('/');
            }
        };
        checkUserRole(); // Initial check when component mounts
        const interval = setInterval(checkUserRole, 60000); // Check every 60 seconds
        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    const [examList, setExamList] = useState([]);

    // Fetch the exam list, able to be taken by the student and is open already, every 60 seconds
    useEffect(() => {
        const fetchExams = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                console.error("Token not found.");
                return;
            }

            try {
                let response = await fetch(`${API_BASE_URL}/exam/examList`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                let data = await response.json();
                console.log(data);

                const contentPromises = data.map(async (exam) => {
                    let resp = await fetch(`${API_BASE_URL}/exam/examContent/${exam}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });
                    if (!resp.ok) {
                        throw new Error('Network response was not ok');
                    }
                    let contentData = await resp.json();
                    console.log(contentData);
                    return contentData;
                });

                const results = await Promise.all(contentPromises);
                setExamList(results);
            } catch (error) {
                console.error("Error fetching exams:", error);
            }
        };

        fetchExams();
        const interval = setInterval(fetchExams, 60000); // Fetch exams every 60 seconds
        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    // Navigate to Exam Page when the exam card is clicked
    const handleExam = (i, y, z) => {
        navigate('/exam', { state: { examName: i, examStartTime: y, examEndTime: z } });
    };

    // Return the Dashboard
    return (
        <StyledContainer maxWidth="sm" maxHeight="xl">
            <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                <img src={logo} alt="Logo" style={{ maxWidth: '150px' }} />
            </Box>
            <InsideContainer maxWidth="xl">
                <div style={{ marginBottom: '30px', textAlign: 'center', width: '100%' }}>My Exams</div>
                <CardBox sx={{ maxWidth: '90vw' }}>

                {/* Maps list of exams able to be taken by the user (student) in the form of cards */}
                {examList.map(exams => (
                    <StyledCard elevation={16} key={exams.id} onClick={() => handleExam(exams.classname, exams.startingTime, exams.endingTime)}>
                        <div style={{ fontSize: 25, textAlign: 'left', width: '100%', marginBottom: '10px', color: 'teal', height: '80px', alignContent: 'center' }}>{exams.classname}</div>
                        <hr style={{ height: '1px', width: '100%', border: 0, marginBottom: '20px', backgroundColor: 'teal' }} />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', width: '100%' }}>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: 18, fontWeight: 400, color: 'green' }}>Start</div>
                                <div style={{ fontSize: 14 }}>{new Date(exams.startingTime).toLocaleString('en-US', {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 18, fontWeight: 400, color: 'red' }}>End</div>
                                <div style={{ fontSize: 14 }}>{new Date(exams.endingTime).toLocaleString('en-US', {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</div>
                            </div>
                        </div>
                    </StyledCard>
                ))}
                </CardBox>
            </InsideContainer>
        </StyledContainer>
    );
};

export default StudentExamOption;