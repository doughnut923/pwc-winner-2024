import React, { useEffect, useState } from 'react';
import { Box, Container, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import logo from "../logo.svg"; // Adjust the path to your logo image
import { StyledContainer } from "./ExamOptionStyledElements"
import { useNavigate } from 'react-router-dom';
import MyTableRow from '../Components/MyTableRow';
import { useTheme } from '@emotion/react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

//List out all students in the system, teacher is allowed to click the student and assign him to an avaliable class.
const AssignClass = () => {

    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(false); // State variable to trigger useEffect

    //is refreshed when the page is loaded or the student list is updated
    const [students, setStudents] = useState([{
        id: 1,
        name: "John Doe",
        classes: ["test1", "test2"]
    },
    {
        id: 2,
        name: "Jane Clark",
        classes: []
    }, {
        id: 1,
        name: "John Doe",
        classes: ["test1", "test2"]
    },
    {
        id: 2,
        name: "Jane Clark",
        classes: []
    }


    ]);

    //format of the student object
    // {
    //     id: Studnet ID (if any),
    //     name: Student Name,
    //     classes : [List of classes]
    // }

    const loadStudents = async () => {
        //then fetch all the student data and store to local array
        try {
            const result = await fetch('api-link', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            });
            if(result.ok){
                const data = await result.json();
                setStudents(data.students);
            }
        } catch (error) {
            console.log(error);
            alert("Could not fetch Students:\n" + error);
        }
    }


    useEffect(() => {
        loadStudents();
    }, [refresh])

    const assignStudent = async (student, clsName) => {
        // send the studentID and classID to the server

        // console.log(student, clsName);
        // try {
        //     const result = await fetch('api-link', {
        //         method: 'POST',
        //         body: JSON.stringify({
        //             studentName: student.name,
        //             classID: clsName
        //         }),
        //         headers: {
        //             Authorization: 'Bearer ' + localStorage.getItem('token'),
        //             'Content-Type': 'application/json'
        //         }
        //     });
        //     if(result.ok){
        //         alert("Student Assigned to Class");
        //         setRefresh(!refresh); // Toggle refresh state to trigger useEffect
        //     }
        // } catch (error) {
        //     console.log(error);
        //     alert("Could not assign student to class:\n" + error);
        // }
    }

    const theme = useTheme();

    // Return the Dashboard form
    return (
        <StyledContainer maxWidth="sm" sx={{
            overflowY: 'hidden',
            height: '100vh',
        }}>

            <Container sx={{ maxwidth: '80%', margin: '50px 0', padding: 0, height: "90vh" }}>
                <Card sx={{ height: "100%", width: '100%', backgroundColor: 'white', borderRadius: '30px', position: "relative" }}>


                    <CardContent>
                        <Box sx={{ position: 'absolute', top: 30, left: 30 }}>
                            <img src={logo} alt="Logo" style={{ maxWidth: '150px' }} />
                        </Box>
                        
                        <Button startIcon={<ArrowBackIosNewIcon/>} sx={{
                            position: 'absolute',
                            top: 78,
                            left: 30
                        }}>Back</Button>
                        
                        <Typography color={theme.palette.primary.main} variant="h5" fontWeight={500} gutterBottom align='center' mb={"40px"} mt={"64px"}>
                            Class assignment
                        </Typography>
                        <TableContainer component={Paper} sx={{
                            width: '80%',
                            margin: '0 auto',
                            borderRadius: '20px',
                            height: '100%',
                            overflowY: 'auto',
                        }} >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Student Name</TableCell>
                                        <TableCell>Classes</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {students.map((student, index) => (
                                        <MyTableRow key={index} student={student} assignStudent={assignStudent} />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Container>
        </StyledContainer>
    );
};

export default AssignClass;