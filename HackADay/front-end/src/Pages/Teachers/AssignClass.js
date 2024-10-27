import React, { useEffect, useState } from 'react';
import { Box, Container, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import logo from "../../logo.svg"; // Adjust the path to your logo image
import { StyledContainer } from "../ExamOptionStyledElements"
import { useNavigate } from 'react-router-dom';
import MyTableRow from '../../Components/MyTableRow';
import { useTheme } from '@emotion/react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

//List out all students in the system, teacher is allowed to click the student and assign him to an avaliable class.
const AssignClass = ({ handleBack }) => {

    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(false); // State variable to trigger useEffect

    const [currentPage, setPage] = useState(0);

    //is refreshed when the page is loaded or the student list is updated
    const [students, setStudents] = useState([]);

    const [DB, setDB] = useState([
        { id: 1, name: "John Doe", classes: ["test1", "test2"] },
        { id: 2, name: "Jane Clark", classes: [] },
        { id: 3, name: "John Tam", classes: ["test1", "test2"] },
        { id: 4, name: "Jane Starling", classes: [] },
        { id: 5, name: "Alice Johnson", classes: ["test3"] },
        { id: 6, name: "Bob Smith", classes: ["test1", "test4"] },
        { id: 7, name: "Charlie Brown", classes: [] },
        { id: 8, name: "Diana Prince", classes: ["test2", "test3"] },
        { id: 9, name: "Eve Adams", classes: ["test1"] },
        { id: 10, name: "Frank Wright", classes: ["test4"] },
        { id: 11, name: "Grace Hopper", classes: ["test2", "test3"] },
        { id: 12, name: "Hank Pym", classes: [] },
        { id: 13, name: "Ivy League", classes: ["test1", "test4"] },
        { id: 14, name: "Jack Daniels", classes: ["test3"] },
        { id: 15, name: "Karen Hill", classes: ["test1"] },
        { id: 16, name: "Larry Page", classes: ["test2", "test4"] },
        { id: 17, name: "Mona Lisa", classes: [] },
        { id: 18, name: "Nina Simone", classes: ["test3"] },
        { id: 19, name: "Oscar Wilde", classes: ["test1", "test2"] },
        { id: 20, name: "Paul Allen", classes: ["test4"] },
        { id: 21, name: "Quincy Jones", classes: ["test2", "test3"] },
        { id: 22, name: "Rachel Green", classes: [] },
        { id: 23, name: "Steve Jobs", classes: ["test1", "test4"] },
        { id: 24, name: "Tom Hanks", classes: ["test3"] },
        { id: 25, name: "Uma Thurman", classes: ["test2"] },
        { id: 26, name: "Vera Wang", classes: ["test1", "test3"] },
        { id: 27, name: "Walt Disney", classes: ["test4"] },
        { id: 28, name: "Xena Warrior", classes: [] },
        { id: 29, name: "Yara Shahidi", classes: ["test2", "test3"] },
        { id: 30, name: "Zara Larsson", classes: ["test1"] },
        { id: 31, name: "Aaron Paul", classes: ["test4"] },
        { id: 32, name: "Betty White", classes: ["test2", "test3"] },
        { id: 33, name: "Chris Evans", classes: [] },
        { id: 34, name: "David Beckham", classes: ["test1", "test4"] },
        { id: 35, name: "Emma Watson", classes: ["test3"] },
        { id: 36, name: "Fiona Apple", classes: ["test2"] },
        { id: 37, name: "George Clooney", classes: ["test1", "test3"] },
        { id: 38, name: "Helen Mirren", classes: ["test4"] },
        { id: 39, name: "Ian McKellen", classes: [] },
        { id: 40, name: "Judy Garland", classes: ["test2", "test3"] },
        { id: 41, name: "Kevin Hart", classes: ["test1"] },
        { id: 42, name: "Liam Neeson", classes: ["test4"] },
        { id: 43, name: "Meryl Streep", classes: ["test2", "test3"] },
        { id: 44, name: "Natalie Portman", classes: [] },
        { id: 45, name: "Oprah Winfrey", classes: ["test1", "test4"] },
        { id: 46, name: "Patrick Stewart", classes: ["test3"] },
        { id: 47, name: "Queen Latifah", classes: ["test2"] },
        { id: 48, name: "Robert Downey Jr.", classes: ["test1", "test3"] },
        { id: 49, name: "Scarlett Johansson", classes: ["test4"] },
        { id: 50, name: "Tom Cruise", classes: [] },
        { id: 51, name: "Uma Thurman", classes: ["test2", "test3"] },
        { id: 52, name: "Vin Diesel", classes: ["test1"] },
        { id: 53, name: "Will Smith", classes: ["test4"] },
        { id: 54, name: "Xander Cage", classes: ["test2", "test3"] },
        { id: 55, name: "Yvonne Strahovski", classes: [] },
        { id: 56, name: "Zachary Levi", classes: ["test1", "test4"] },
        { id: 57, name: "Amy Adams", classes: ["test3"] },
        { id: 58, name: "Brad Pitt", classes: ["test2"] },
        { id: 59, name: "Cate Blanchett", classes: ["test1", "test3"] },
        { id: 60, name: "Daniel Craig", classes: ["test4"] },
        { id: 61, name: "Eva Green", classes: [] },
        { id: 62, name: "Forest Whitaker", classes: ["test2", "test3"] },
        { id: 63, name: "Gwyneth Paltrow", classes: ["test1"] },
        { id: 64, name: "Hugh Jackman", classes: ["test4"] },
        { id: 65, name: "Isla Fisher", classes: ["test2", "test3"] },
        { id: 66, name: "Jake Gyllenhaal", classes: [] },
        { id: 67, name: "Kate Winslet", classes: ["test1", "test4"] },
        { id: 68, name: "Leonardo DiCaprio", classes: ["test3"] },
        { id: 69, name: "Maggie Gyllenhaal", classes: ["test2"] },
        { id: 70, name: "Naomi Watts", classes: ["test1", "test3"] },
        { id: 71, name: "Orlando Bloom", classes: ["test4"] },
        { id: 72, name: "Penelope Cruz", classes: [] },
        { id: 73, name: "Quentin Tarantino", classes: ["test2", "test3"] },
        { id: 74, name: "Renee Zellweger", classes: ["test1"] },
        { id: 75, name: "Samuel L. Jackson", classes: ["test4"] },
        { id: 76, name: "Tilda Swinton", classes: ["test2", "test3"] },
        { id: 77, name: "Uma Thurman", classes: [] },
        { id: 78, name: "Viggo Mortensen", classes: ["test1", "test4"] },
        { id: 79, name: "Winona Ryder", classes: ["test3"] },
        { id: 80, name: "Xander Cage", classes: ["test2"] },
        { id: 81, name: "Yvonne Strahovski", classes: ["test1", "test3"] },
        { id: 82, name: "Zachary Levi", classes: ["test4"] },
        { id: 83, name: "Amy Adams", classes: [] },
        { id: 84, name: "Brad Pitt", classes: ["test2", "test3"] },
        { id: 85, name: "Cate Blanchett", classes: ["test1"] },
        { id: 86, name: "Daniel Craig", classes: ["test4"] },
        { id: 87, name: "Eva Green", classes: ["test2", "test3"] },
        { id: 88, name: "Forest Whitaker", classes: [] },
        { id: 89, name: "Gwyneth Paltrow", classes: ["test1", "test4"] },
        { id: 90, name: "Hugh Jackman", classes: ["test3"] },
        { id: 91, name: "Isla Fisher", classes: ["test2"] },
        { id: 92, name: "Jake Gyllenhaal", classes: ["test1", "test3"] },
        { id: 93, name: "Kate Winslet", classes: ["test4"] },
        { id: 94, name: "Leonardo DiCaprio", classes: [] },
        { id: 95, name: "Maggie Gyllenhaal", classes: ["test2", "test3"] },
        { id: 96, name: "Naomi Watts", classes: ["test1"] },
        { id: 97, name: "Orlando Bloom", classes: ["test4"] },
        { id: 98, name: "Penelope Cruz", classes: ["test2", "test3"] },
        { id: 99, name: "Quentin Tarantino", classes: [] },
        { id: 100, name: "Renee Zellweger", classes: ["test1", "test4"] }
    ]);

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
            const result = await fetch(`http://localhost:8081/user/studentWithClasses?pageNum=${currentPage}`, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                }
            });

            if(result.ok){
                const data = await result.json();
                if(data.length === 0){
                    alert("No more students to display");
                    setPage(0);
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
        if ((currentPage + 1) * 5 < DB.length) {
            setPage(currentPage + 1);
            setRefresh(!refresh);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setPage(currentPage - 1);
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

        // console.log(student, clsName);
        // try {
        //     const result = await fetch('api-link', {
        //         method: 'PUT',
        //         body: JSON.stringify({
        //             studentName: student.name,
        //             permission: clsName
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

        let temp = DB;
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].name === student.name) {
                temp[i].classes.push(clsName);
                break;
            }
        }

        setDB(temp);
        setRefresh(!refresh);
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
                            <Button onClick={handlePreviousPage} disabled={currentPage === 0}>
                                Previous Page
                            </Button>
                            <Button onClick={handleNextPage} disabled={(currentPage + 1) * 5 >= DB.length}>
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