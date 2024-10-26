import React, { useState } from 'react';
import logo from "../../logo.svg"; // Adjust the path to your logo image
import { useNavigate } from 'react-router-dom';
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
    const [status, setStatus] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [open, setOpen] = useState(false);
    const [modelId, setModelId] = useState(0);

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    const [itemList, setItemList] = useState([
        { id: 0, name: 'Attribute One', status: '0', alerts: '0', alertContent: [{}] },
        { id: 1, name: 'Attribute Two', status: '0', alerts: '0', alertContent: [{}] },
        { id: 2, name: 'Attribute Three', status: '0', alerts: '0', alertContent: [] },
        { id: 3, name: 'Another Attribute', status: '0', alerts: '3', alertContent: [{title: "One", image: "none", time: "00:11:00"}, {title: "Two", image: "none", time: "00:11:00"}, {title: "Three", image: "none", time: "00:11:00"}] },
        { id: 4, name: 'Filterable Item', status: '0', alerts: '2', alertContent: [{title: "Two", image: "none", time: "00:11:00"}, {title: "One", image: "none", time: "00:11:00"}] }
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = itemList.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (status === '' || item.status === status)
    );

    const clearFilters = () => {
        setSearchTerm('');
        setStatus('');
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

    const suspendSelectedItems = () => {
        setItemList(prevItemList => 
            prevItemList.map(item => 
                selectedIds.includes(item.id) ? { ...item, previousStatus: item.status, status: '1' } : item
            )
        );
        setSelectedIds([]); // Clear the selected items
    };

    const unsuspendSelectedItems = () => {
        setItemList(prevItemList => 
            prevItemList.map(item => 
                selectedIds.includes(item.id) && item.status === '1' ? { ...item, status: item.previousStatus } : item
            )
        );
        setSelectedIds([]); // Clear the selected items
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
                <div style={{ color: 'gray', fontSize: 20, marginLeft: 30, marginTop: 20, wordSpacing: 10, fontWeight: 700, fontFamily: 'monospace' }}>{'< BACK'}</div>
                <div style={{ textAlign: 'center', marginTop: '70px' }}>
                    <div style={{ fontSize: 30, fontWeight: 400, color: 'teal' }}>Time Left</div>
                    <div style={{ fontSize: 100, fontWeight: 200 }}>00:00:00</div>
                </div>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                        display: 'flex',
                        alignItems: 'center'
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
                    <TextField
                        id="outlined-attribute"
                        select
                        value={status}
                        label="Status"
                        onChange={handleStatusChange}
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="0">Active</MenuItem>
                        <MenuItem value="1">Suspended</MenuItem>
                    </TextField>
                    <Box sx={{ marginRight: "100px" }}>
                        <IconButton onClick={clearFilters}>
                            <FilterAltOffIcon />
                        </IconButton>
                    </Box>
                    <Stack spacing={2} direction="row">
                        <Button variant="outlined" color="black" onClick={unsuspendSelectedItems}>UNSUSPEND</Button>
                        <Button variant="contained" color="error" onClick={suspendSelectedItems}>SUSPEND</Button>
                    </Stack>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width='3%'>
                                <Checkbox 
                                    indeterminate={selectedIds.length > 0 && selectedIds.length < filteredItems.length}
                                    checked={filteredItems.length > 0 && selectedIds.length === filteredItems.length}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>
                            <TableCell width='45%'>User</TableCell>
                            <TableCell align='center'>Account Status</TableCell>
                            <TableCell>Alerts</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody style={{ alignItems: 'center'}}>
                        {filteredItems.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Checkbox 
                                        checked={selectedIds.includes(item.id)}
                                        onChange={() => handleCheckboxChange(item.id)}
                                    />
                                </TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell align='center'>
                                    {item.status === "0" ? (
                                        <div style={{
                                            background: "green",
                                            paddingTop: "3px",
                                            paddingBottom: "3px",
                                            borderRadius: "100px",
                                            color: "white",
                                            width: "120px",
                                            margin: "auto",
                                            textAlign: "center",
                                        }}>Active</div>
                                    ) : item.status === "1" ? (
                                        <div style={{
                                            background: "red",
                                            paddingTop: "3px",
                                            paddingBottom: "3px",
                                            borderRadius: "100px",
                                            color: "white",
                                            width: "120px",
                                            margin: "auto",
                                            textAlign: "center",
                                        }}>Suspended</div>
                                    ) : ""}
                                </TableCell>
                                <TableCell>
                                    {item.alerts !== "0" ? 
                                        (<a style={{ color: "red" }} onClick={() => handleOpen(item.id)}>{item.alerts}</a>) : <a>{item.alerts}</a>}
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
                            minHeight: '100vh', // Ensure the box takes up the full viewport height
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
                                justifyContent: 'center', // Center content vertically within the modal
                                textAlign: 'center',
                                color: 'GrayText'
                            }}
                        >
                            Press 'ESC' key to exit the modal!
                            <Carousel autoPlay={false}>
                                {itemList[modelId].alertContent.map((item, i) => (
                                    <div key={i} style={{textAlign: 'center', alignContent: 'center', color: 'black'}}>
                                        <h2>{item.title}</h2>
                                        <img src=""/>
                                        <p>{item.time}</p>
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
