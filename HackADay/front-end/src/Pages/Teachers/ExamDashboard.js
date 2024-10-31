import React, { useEffect, useState } from 'react';
import logo from "../../logo.svg"; // Adjust the path to your logo image
import { useNavigate, useLocation } from 'react-router-dom';
import { StyledContainer, InsideContainer } from "./ExamDashboardStyledElements";
import { TextField, Box, TableHead, TableRow, Table, TableBody, TableCell, IconButton, Modal } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

const ExamDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem('role');
    if (role !== "teacher") navigate('/');

    const token = localStorage.getItem('token');

    // Get the exam's name from previous page
    const { examName } = location.state || {};

    // Fetch the exam information (starting time and ending time)
    const [examStartTime, setExamStartTime] = useState();
    const [examEndTime, setExamEndTime] = useState();
    const examInfo = async () => {
        const token = localStorage.getItem('token');
        let resp = await fetch(`http://52.64.153.206:8081/exam/examContent/${examName}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        let contentData = await resp.json();
        setExamStartTime(contentData.startingTime);
        setExamEndTime(contentData.endingTime);

        fetchStudentList()
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            examInfo();
        }, 30000); // 30 seconds
        examInfo(); // Initial fetch

        return () => clearInterval(intervalId); 
    }, []);

    // Countdown Timer
    const [timeLeft, setTimeLeft] = useState("");
    const [timeStatus, setTimeStatus] = useState("Not Started!");
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const start = new Date(examStartTime);
            const end = new Date(examEndTime);

            if (now < start) {
                setTimeStatus("Not Started!");
                setTimeLeft("");
            } else if (now >= start && now <= end) {
                setTimeStatus("Exam in Progress");
                const totalSeconds = Math.floor((end - now) / 1000);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
            } else {
                setTimeStatus("Exam Ended");
                setTimeLeft("");
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [examStartTime, examEndTime]);

    // Get exam's participants
    const [students, setStudents] = useState([]);

    const fetchStudentList = async () => {
        try {
            let response = await fetch(`http://52.64.153.206:8081/authority/studentList/${examName}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            let data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error("Error fetching student list:", error);
        }
    };

    useEffect(() => {

    }, [examName, token]);

    // Function to fetch suspicious images
    const fetchSuspiciousImagesForStudent = async (studentName) => {
        try {
            let response = await fetch(`http://52.64.153.206:8081/status/suspiciousImage?classname=${examName}&username=${studentName}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            let data = await response.json();
            return data; // Expecting an array of images
        } catch (error) {
            console.error(`Error fetching suspicious images for ${studentName}:`, error);
            return [];
        }
    };

    // Function to fetch images and place to the right student/exam participant
    const [itemList, setItemList] = useState([]);
    const fetchAllSuspiciousImages = async () => {
        const imagePromises = students.map(async (student) => {
            const images = await fetchSuspiciousImagesForStudent(student);
            return { student, images };
        });
        const imageResults = await Promise.all(imagePromises);

        const newItemList = imageResults.map((result, index) => ({
            id: index,
            name: result.student,
            alerts: result.images.length.toString(),
            alertContent: result.images.map(image => ({ image }))
        }));

        setItemList(newItemList);
    };


    // Fetch suspicious images every 30 seconds
    useEffect(() => {
        if (students.length) {
            fetchAllSuspiciousImages(); // Initial fetch

            const intervalId = setInterval(() => {
                fetchAllSuspiciousImages();
            }, 30000); // 30 seconds

            return () => clearInterval(intervalId); // Cleanup interval on unmount
        }
    }, [students]);

    // Search Filter component
    const [searchTerm, setSearchTerm] = useState('');

    // Search Function
    const filteredItems = itemList.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Clear Search
    const clearFilters = () => {
        setSearchTerm('');
    };

    const [open, setOpen] = useState(false); // Handle Modal
    const [modelId, setModelId] = useState(0); // Ensure the modal opened belongs to the student

    // Open Modal
    const handleOpen = (id) => {
        setOpen(true);
        setModelId(id); // Ensure the modal opened belongs to the student
    }

    // Close Modal
    const handleClose = () => {
        setOpen(false);
        setModelId(0); // Set the modal index to default (set to 0)
    }

    return (
        <StyledContainer>
            <InsideContainer maxWidth="xl" style={{ padding: '60px' }}>

                {/* Timer */}
                <img src={logo} alt="Logo" style={{ maxWidth: '150px' }} />
                <div onClick={() => navigate('/teacher-exam-option')} style={{ color: 'gray', fontSize: 20, marginLeft: 30, marginTop: 20, wordSpacing: 10, fontWeight: 700, fontFamily: 'monospace', cursor: 'pointer' }}>{'< BACK'}</div>
                <div style={{ textAlign: 'center', marginTop: '70px' }}>
                    <div style={{ fontSize: 30, fontWeight: 400, color: 'teal' }}>Time Left</div>
                    {timeStatus === "Exam in Progress" ? <div style={{ fontSize: 100, fontWeight: 200 }}>{timeLeft}</div> :
                        <div style={{ fontSize: 80, fontWeight: 200 }}>{timeStatus}</div>}
                </div>

                {/* Search Bar */}
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                        display: 'flex',
                        alignItems: 'center',
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        id="outlined-search"
                        label="Search (Name, Email, etc...)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Box>
                        <IconButton onClick={clearFilters}>
                            <FilterAltOffIcon />
                        </IconButton>
                    </Box>
                </Box>

                {/* Exam Participant List */}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width='70%'>User</TableCell>
                            <TableCell>Alerts</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody style={{ alignItems: 'center' }}>
                        {filteredItems.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>
                                    {item.alerts !== "0" ?
                                        (<div style={{ color: "red", cursor: "pointer" }} onClick={() => handleOpen(item.id)}>{item.alerts}</div>) : <div>{item.alerts}</div>}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Can Only be opened when, the alert is more than 0 */}
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '100vh',
                        }}
                    >
                        <Box
                            sx={{
                                width: '90%',
                                height: '90%',
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                textAlign: 'center',
                                color: 'GrayText'
                            }}
                        >
                            Press 'ESC' key to exit the modal!
                            <Carousel autoPlay={false}>
                                {
                                    itemList[modelId] && itemList[modelId].alertContent.map((item, i) => {
                                        console.log(item.image)
                                        return (
                                            <div key={i} style={{ textAlign: 'center', alignContent: 'center', color: 'black' }}>
                                                <img src={`data:image/jpeg;base64,${item.image.imageFile}`} alt={`Suspicious activity - ${i} @ ${item.image.timestamp}`} />
                                                <p>{`Suspicious activity - ${i} @ ${new Date(item.image.timestamp).toLocaleString('en-us', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit'
                                                })}`}</p>
                                            </div>
                                        );
                                    })
                                }
                            </Carousel>
                        </Box>
                    </Box>
                </Modal>
            </InsideContainer>
        </StyledContainer>
    );
};

export default ExamDashboard;
