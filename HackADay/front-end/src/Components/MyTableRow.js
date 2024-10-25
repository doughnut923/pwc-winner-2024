import React, { useState } from 'react';
import { TableRow, TableCell, Button, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material';
import AssignClassSelector from './AssignClassSelector';


//format of the student object
// {
//     id: Studnet ID (if any),
//     name: Student Name,
//     classes : [List of classes]
// }


const MyTableRow = ({ student, assignStudent }) => {

    const [onAdd, setOnAdd] = React.useState(false);

    return (
        // <></>
        <TableRow>
            <TableCell>{student.name}</TableCell>
            <TableCell>
                {
                    student.classes.map((cls, index) => (
                        <Chip key={index} sx={{ marginRight: "8px" }} label={cls} />
                    ))
                }
                <IconButton onClick={
                    () => {
                        setOnAdd(!onAdd);
                        // assignStudent(student, "test3");
                    }
                }>
                    <AddIcon />
                </IconButton>
                {onAdd && <AssignClassSelector setOnAdd={setOnAdd} student={student} assignclasss={assignStudent} />}
            </TableCell>
        </TableRow>
    );
};

export default MyTableRow;