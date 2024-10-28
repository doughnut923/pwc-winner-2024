import React, { useEffect, useState } from 'react';
import logo from "../../logo.svg"; // Adjust the path to your logo image
import { useNavigate, useLocation } from 'react-router-dom';
import { StyledContainer, InsideContainer } from "./ExamDashboardStyledElements";
import { MenuItem, TextField, Box, TableHead, TableRow, Table, TableBody, TableCell, Checkbox, IconButton, Button, Stack, Modal } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const ExamDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem('role');
    if (role != "teacher") navigate('/');
    
    const token = localStorage.getItem('token');

    const { examName } = location.state || {};
    const [examStartTime, setExamStartTime] = useState();
    const [examEndTime, setExamEndTime] = useState();
    const [timeLeft, setTimeLeft] = useState("");
    const [timeStatus, setTimeStatus] = useState("Not Started!");

    const examContent = async() => {
        const token = localStorage.getItem('token');
        let resp = await fetch(`http://localhost:8081/exam/examContent/${examName}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        let contentData = await resp.json();
        setExamStartTime(contentData.startingTime);
        setExamEndTime(contentData.endingTime);
    }

    examContent();


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

    const [selectedIds, setSelectedIds] = useState([]);
    const [open, setOpen] = useState(false);
    const [modelId, setModelId] = useState(0);


    const [students, setStudents] = useState([]);
    const [itemList, setItemList] = useState([]);

    useEffect(() => {
        const fetchStudentList = async () => {
            try {
                let response = await fetch(`http://localhost:8081/authority/studentList/${examName}`, {
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

        fetchStudentList();
    }, [examName, token]);

    const fetchSuspiciousImagesForStudent = async (studentName) => {
        try {
            let response = await fetch(`http://localhost:8081/status/suspiciousImage?classname=${examName}&username=${studentName}`, {
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

    useEffect(() => {
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

        if (students.length) {
            fetchAllSuspiciousImages();
        }
    }, [students]);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = itemList.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const clearFilters = () => {
        setSearchTerm('');
    };

    const handleCheckboxChange = (id) => {
        setSelectedIds(prevSelectedIds => 
            prevSelectedIds.includes(id)
                ? prevSelectedIds.filter(selectedId => selectedId !== id)
                : [...prevSelectedIds, id]
        );
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelectedIds = filteredItems.map((item) => item.id);
            setSelectedIds(newSelectedIds);
            return;
        }
        setSelectedIds([]);
    };

    const handleOpen = (id) => {
        setOpen(true);
        setModelId(id);
    }

    const handleClose = () => {
        setOpen(false);
        setModelId(0);
    }

    return (
        <StyledContainer>
            <InsideContainer maxWidth="xl" style={{ padding: '60px' }}>
                <img src={logo} alt="Logo" style={{ maxWidth: '150px' }} />
                <div onClick={() => navigate('/teacher-exam-option')} style={{ color: 'gray', fontSize: 20, marginLeft: 30, marginTop: 20, wordSpacing: 10, fontWeight: 700, fontFamily: 'monospace', cursor: 'pointer' }}>{'< BACK'}</div>
                <div style={{ textAlign: 'center', marginTop: '70px' }}>
                    <div style={{ fontSize: 30, fontWeight: 400, color: 'teal' }}>Time Left</div>
                    {timeStatus === "Exam in Progress" ? <div style={{fontSize: 100, fontWeight: 200}}>{timeLeft}</div> :
                        <div style={{fontSize: 80, fontWeight: 200}}>{timeStatus}</div>}
                </div>
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
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width='70%'>User</TableCell>
                            <TableCell>Alerts</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody style={{ alignItems: 'center'}}>
                        {filteredItems.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>
                                    {item.alerts !== "0" ?
                                        (<a style={{ color: "red", cursor: "pointer" }} onClick={() => handleOpen(item.id)}>{item.alerts}</a>) : <a>{item.alerts}</a>}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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
                                width: '50%',
                                height: '50%',
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
                                {itemList[modelId] && itemList[modelId].alertContent.map((item, i) => (
                                    <div key={i} style={{ textAlign: 'center', alignContent: 'center', color: 'black' }}>
                                        <img src={`data:image/jpeg;base64,${item.image}`} alt={`Suspicious activity - ${i}`} />
                                    </div>
                                ))}
                            </Carousel>
                        </Box>
                    </Box>
                </Modal>
            </InsideContainer>
        </StyledContainer>
    );
};

export default ExamDashboard;
