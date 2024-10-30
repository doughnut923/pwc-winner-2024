import React from 'react';
import { TableRow, TableCell, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material';
import AssignClassSelector from './AssignClassSelector';


//format of the student object
// {
//     id: Studnet ID (if any),
//     name: Student Name,
//     classes : [List of classes]
// }


const MyTableRow = ({ index, student, assignStudent }) => {

    const [onAdd, setOnAdd] = React.useState(false);

    return (
        // <></>
        <TableRow>
            <TableCell>{index + 1}</TableCell>
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