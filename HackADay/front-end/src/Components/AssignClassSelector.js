import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, CircularProgress, Box } from '@mui/material';

const AssignClassSelector = ({setOnAdd, student, assignclasss }) => {
    const [classes, setClasses] = useState(["test 1"]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // const fetchClasses = async () => {
        //     try {
        //         const response = await fetch('/api/classes'); // Adjust the URL as needed
        //         const data = await response.json();
        //         setClasses(data);
        //     } catch (error) {
        //         console.error('Error fetching classes:', error);
        //     } finally {
        //         setLoading(false);
        //     }
        // };
        setLoading(false);
        // fetchClasses();
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