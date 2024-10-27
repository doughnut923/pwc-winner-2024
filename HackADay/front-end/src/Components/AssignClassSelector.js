import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, CircularProgress, Box } from '@mui/material';

const AssignClassSelector = ({ setOnAdd, student, assignclasss }) => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchClasses = async () => {

        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }

        const result = await fetch('http://localhost:8081/exam/examList', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        });
        if (result.ok) {
            const data = await result.json();
            setClasses(data);
            setLoading(false);
            return;
        }
        if (result.status === 403) {
            console.log("Unauthorized");
            return;
        }

    };

    useEffect(() => {
        setLoading(true);
        fetchClasses();
    }, []);

    const handleClassClick = (selectedClass) => {
        assignclasss(student, selectedClass);
        setOnAdd(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="body" fontWeight={500}>
                Select a Class:
            </Typography>
            <List>
                {classes.map((classItem, index) => (
                    <ListItem button key={index} onClick={() => handleClassClick(classItem)} sx={{
                        width: 'fit-content',
                        padding: "5px 10px",
                        borderRadius: "20px",
                        marginBottom: "5px",
                        backgroundColor: "#f1f1f1",
                        ":hover": {
                            cursor: "pointer",
                        }
                    }}>
                        <Typography variant='body'>{classItem}</Typography>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default AssignClassSelector;