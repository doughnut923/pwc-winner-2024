import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import logo from "../../logo.svg";
import { StyledContainer, StyledCard, InsideContainer, CardBox } from "./TeacherExamOptionStyledElements"
import AssignClass from './AssignClass';
import { useNavigate } from 'react-router-dom';



const TeacherExamOption = () => {
    const navigate = useNavigate();
    const [assignClass, setAssignClass] = useState(0);

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        if (userRole != "teacher") navigate('/');
    })

    const [examList, setExamList] = useState([]);

    useEffect(() => {
        const fetchExams = async () => {
            const token = localStorage.getItem('token');
    
            if (!token) {
                console.error("Token not found.");
                return;
            }
    
            try {
                let response = await fetch("http://localhost:8081/exam/examList", {
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
                    let resp = await fetch(`http://localhost:8081/exam/examContent/${exam}`, {
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
    
        const interval = setInterval(fetchExams, 60000);
    
        return () => clearInterval(interval);
    }, []);

    const handleClick = (e) => {
        e.preventDefault();
        setAssignClass(1);
    }

    const handleBack = (e) => {
        e.preventDefault();
        setAssignClass(0);
    }

    const handleExam = (i, y, z) => {
        navigate('/exam-dashboard', { state: { examName: i} }); 
    }

    // Return the Dashboard form
    return (
        <StyledContainer maxWidth="sm">
            {!assignClass ? (
                <div>
                    <Box sx={{ position: 'absolute', top: 16, left: 16, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <img src={logo} alt="Logo" style={{ maxWidth: '150px' }} />
                        <Button variant='text' onClick={handleClick}>Assign Class</Button>
                        <Button variant='text' onClick={() => {
                            navigate("/create-class")
                        }}>Create Class</Button>
                    </Box>
                    <InsideContainer maxWidth="xl">
                        <div style={{ marginBottom: '30px', textAlign: 'center', width: '100%' }}>My Exams</div>
                        <CardBox maxWidth="xl">
                            {examList.map(exams => (
                                <StyledCard elevation={16} key={exams.id} onClick={() => handleExam(exams.classname, exams.startingTime, exams.endingTime)}>
                                    {/* <div style={{ fontSize: 15, textAlign: 'left', width: '100%', marginBottom: '10px' }}>{exams.code}</div> */}
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
                </div>
            ) : <AssignClass handleBack={handleBack}/>}
            
        </StyledContainer>
    );
};

export default TeacherExamOption;