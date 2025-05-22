import React, { useEffect, useState } from 'react';
import { Box, Container, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import logo from "../../logo.svg"; // Adjust the path to your logo image
import { StyledContainer } from "../ExamOptionStyledElements"
import MyTableRow from '../../Components/MyTableRow';
import { useTheme } from '@emotion/react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { API_BASE_URL } from '../../config'; // Import the API base URL

//List out all students in the system, teacher is allowed to click the student and assign him to an avaliable class.
const AssignClass = ({ handleBack }) => {

    const [refresh, setRefresh] = useState(false); // State variable to trigger useEffect

    const [currentPage, setPage] = useState(0);

    //is refreshed when the page is loaded or the student list is updated
    const [students, setStudents] = useState([]);


    //format of the student object
    // {
    //     id: Studnet ID (if any),
    //     name: Student Name,
    //     classes : [List of classes]
    // }

    const handleStudentAPIData = (data) => {
        console.log(data);
        let temp = [];
        for (let i = 0; i < data.length; i++) {
            let student = {
                id: i,
                name: data[i].username,
                classes: []
            }
            for (let j = 0; j < data[i].authorities.length; j++) {
                student.classes.push(data[i].authorities[j].permission);
            }
            temp.push(student);
        }
        return temp;
    }

    const loadStudents = async () => {

        // setStudents(DB.slice(currentPage, currentPage + 5));
        // then fetch all the student data and store to local array
        console.log("Fetching Students");
        try {
            const result = await fetch(`${API_BASE_URL}/user/studentWithClasses?pageNum=${currentPage}`, { // Use API_BASE_URL
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                }
            });

            if (result.ok) {
                const data = await result.json();
                console.log(data);
                if (data.length === 0) {
                    alert("No more students to display");
                    setPage(1);
                    return 0;
                }
                const temp = handleStudentAPIData(data);
                console.log(temp);
                setStudents(temp);
            }
        } catch (error) {
            console.log(error);
            alert("Could not fetch Students:\n" + error);
            setPage(0);
            return 0;
        }
        return 1;
    }

    const handleNextPage = () => {
        setPage(currentPage + 10);
        setRefresh(!refresh);
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setPage(currentPage - 10);
            setRefresh(!refresh);
        }
    };

    // const checkAuthority = async () => {
    //     try {
    //         const result = await fetch('http://localhost', {
    //             method: 'GET',
    //             headers: {
    //                 Authorization: 'Bearer ' + localStorage.getItem('token'),
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         if (result.ok) {
    //             const data = await result.json();
    //             setStudents(data.students);
    //         }
    //     } catch (error) {
    //         navigate('/login');
    //     }
    // }


    useEffect(() => {
        loadStudents();
    }, [refresh])

    const assignStudent = async (student, clsName) => {
        console.log(`Assign ${student.name} to class ${clsName}?`);
        // send the studentID and classID to the server

        if(student.classes.includes(clsName)){
            alert("User already Enrolled in " + clsName);
            return
        }

        try {
            const result = await fetch(`${API_BASE_URL}/authority/setAuthorities`, { // Use API_BASE_URL
                method: 'PUT',
                body: JSON.stringify([{
                    username: student.name,
                    permission: clsName
                }]),
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            });
            if (result.ok) {
                alert("Student Assigned to Class");
                setRefresh(!refresh); // Toggle refresh state to trigger useEffect
            }
        } catch (error) {
            console.log(error);
            alert("Could not assign student to class:\n" + error);
        }

        // let temp = DB;
        // for (let i = 0; i < temp.length; i++) {
        //     if (temp[i].name === student.name) {
        //         temp[i].classes.push(clsName);
        //         break;
        //     }
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

                        <Button startIcon={<ArrowBackIosNewIcon />} sx={{
                            position: 'absolute',
                            top: 78,
                            left: 30
                        }}
                            onClick={handleBack}>Back</Button>


                        <Typography color={theme.palette.primary.main} variant="h5" fontWeight={500} gutterBottom align='center' mb={"40px"} mt={"64px"}>
                            Class assignment
                        </Typography>
                        <Box align={"center"}>
                            <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
                                Previous Page
                            </Button>
                            <Button onClick={handleNextPage}>
                                Next Page
                            </Button>
                        </Box>
                        <TableContainer component={Paper} sx={{
                            width: '80%',
                            margin: '0 auto',
                            borderRadius: '20px',
                            height: '55vh',
                            overflowY: 'scroll',
                        }} >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell>Student Name</TableCell>
                                        <TableCell>Classes</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {students.map((student, index) => (
                                        <MyTableRow index={index} student={student} assignStudent={assignStudent} />
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