import React from 'react';
import { Box } from '@mui/material';
import logo from "../../logo.svg"; // Adjust the path to your logo image
import { StyledContainer, StyledCard, InsideContainer, CardBox } from "./StudentExamOptionStyledElements"



const StudentExamOption = () => {

    // const examOption = await fetch("");

    const examOption = useState([
        {
            id: 0,
            code: 'CSCI1000',
            title: 'Introduction to Computer Science and Data Science',
            start: '10:00',
            student: 90,
        },
        {
            id: 1,
            code: 'CSCI1000',
            title: 'Introduction to Computer Science and Data Science',
            start: '10:00',
            student: 90,
        },
        {
            id: 2,
            code: 'CSCI1000',
            title: 'Introduction to Computer Science and Data Science',
            start: '10:00',
            student: 90,
        },
        {
            id: 3,
            code: 'CSCI1000',
            title: 'Introduction to Computer Science and Data Science',
            start: '10:00',
            student: 90,
        },
        {
            id: 4,
            code: 'CSCI1000',
            title: 'Introduction to Computer Science and Data Science',
            start: '10:00',
            student: 90,
        },
    ]);

    // Return the Dashboard form
    return (
        <StyledContainer maxWidth="sm">
            <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                <img src={logo} alt="Logo" style={{ maxWidth: '150px' }} />
            </Box>
            <InsideContainer maxWidth="xl">
                <div style={{ marginBottom: '30px', textAlign: 'center', width: '100%' }}>My Exams</div>
                <CardBox maxWidth="xl">
                    {examOption.map(exams => (
                        <StyledCard elevation={16} key={exams.id}>
                            <div style={{ fontSize: 15, textAlign: 'left', width: '100%', marginBottom: '10px' }}>{exams.code}</div>
                            <div style={{ fontSize: 25, textAlign: 'left', width: '100%', marginBottom: '10px', color: 'teal', height: '80px', alignContent: 'center' }}>{exams.title}</div>
                            <hr style={{ height: '1px', width: '100%', border: 0, marginBottom: '20px', backgroundColor: 'teal' }} />
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', width: '100%' }}>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontSize: 18, fontWeight: 400, color: 'green' }}>Start</div>
                                    <div style={{ fontSize: 14 }}>{exams.start}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 18, fontWeight: 400, color: 'red' }}>Student</div>
                                    <div style={{ fontSize: 14 }}>{examOption.student}</div>
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