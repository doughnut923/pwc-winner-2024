import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import logo from "../logo.svg"; // Adjust the path to your logo image
import { useNavigate } from 'react-router-dom';
import{ StyledContainer, StyledCard, InsideContainer, CardBox } from "./DashboardStyledElements"



const Dashboard = () => {    

    // Use the navigate hook to redirect the user to the signup page
    const navigate = useNavigate();

    // Return the Dashboard form
    return (
        <StyledContainer maxWidth="sm">
            <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                <img src={logo} alt="Logo" style={{ maxWidth: '150px' }} />
            </Box>
            <InsideContainer maxWidth="xl">
                <div style={{marginBottom: '30px', textAlign: 'center', width: '100%'}}>My Exams</div>
                <CardBox maxWidth="xl">
                    <StyledCard elevation={16}>
                        <div style={{fontSize: 15, textAlign: 'left', width: '100%', marginBottom: '10px'}}>CSCI1000</div>
                        <div style={{fontSize: 25, textAlign: 'left', width: '100%', marginBottom: '10px', color: 'teal', height: '80px', alignContent: 'center'}}>Introduction to Computer Science and Data Science</div>
                        <hr style={{height: '1px', width: '100%', border: 0, marginBottom: '20px', backgroundColor: 'teal'}}/>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', width: '100%'}}>
                            <div style={{textAlign: 'left'}}>
                                <div style={{fontSize: 18, fontWeight: 400, color: 'green'}}>Start</div>
                                <div style={{fontSize: 14}}>10:00</div>
                            </div>
                            <div style={{textAlign: 'right'}}>
                                <div style={{fontSize: 18, fontWeight: 400, color: 'red'}}>Student</div>
                                <div style={{fontSize: 14}}>90</div>
                            </div>
                        </div>
                    </StyledCard>
                    <StyledCard elevation={16}>
                        <div style={{fontSize: 15, textAlign: 'left', width: '100%', marginBottom: '10px'}}>CSCI1000</div>
                        <div style={{fontSize: 25, textAlign: 'left', width: '100%', marginBottom: '10px', color: 'teal', height: '80px', alignContent: 'center'}}>Introduction to Computer Science and Data Science</div>
                        <hr style={{height: '1px', width: '100%', border: 0, marginBottom: '20px', backgroundColor: 'teal'}}/>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', width: '100%'}}>
                            <div style={{textAlign: 'left'}}>
                                <div style={{fontSize: 18, fontWeight: 400, color: 'green'}}>Start</div>
                                <div style={{fontSize: 14}}>10:00</div>
                            </div>
                            <div style={{textAlign: 'right'}}>
                                <div style={{fontSize: 18, fontWeight: 400, color: 'red'}}>Student</div>
                                <div style={{fontSize: 14}}>90</div>
                            </div>
                        </div>
                    </StyledCard>
                    <StyledCard elevation={16}>
                        <div style={{fontSize: 15, textAlign: 'left', width: '100%', marginBottom: '10px'}}>CSCI1000</div>
                        <div style={{fontSize: 25, textAlign: 'left', width: '100%', marginBottom: '10px', color: 'teal', height: '80px', alignContent: 'center'}}>Introduction to Computer Science and Data Science</div>
                        <hr style={{height: '1px', width: '100%', border: 0, marginBottom: '20px', backgroundColor: 'teal'}}/>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', width: '100%'}}>
                            <div style={{textAlign: 'left'}}>
                                <div style={{fontSize: 18, fontWeight: 400, color: 'green'}}>Start</div>
                                <div style={{fontSize: 14}}>10:00</div>
                            </div>
                            <div style={{textAlign: 'right'}}>
                                <div style={{fontSize: 18, fontWeight: 400, color: 'red'}}>Student</div>
                                <div style={{fontSize: 14}}>90</div>
                            </div>
                        </div>
                    </StyledCard>
                    <StyledCard elevation={16}>
                        <div style={{fontSize: 15, textAlign: 'left', width: '100%', marginBottom: '10px'}}>CSCI1000</div>
                        <div style={{fontSize: 25, textAlign: 'left', width: '100%', marginBottom: '10px', color: 'teal', height: '80px', alignContent: 'center'}}>Introduction to Computer Science and Data Science</div>
                        <hr style={{height: '1px', width: '100%', border: 0, marginBottom: '20px', backgroundColor: 'teal'}}/>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', width: '100%'}}>
                            <div style={{textAlign: 'left'}}>
                                <div style={{fontSize: 18, fontWeight: 400, color: 'green'}}>Start</div>
                                <div style={{fontSize: 14}}>10:00</div>
                            </div>
                            <div style={{textAlign: 'right'}}>
                                <div style={{fontSize: 18, fontWeight: 400, color: 'red'}}>Student</div>
                                <div style={{fontSize: 14}}>90</div>
                            </div>
                        </div>
                    </StyledCard>
                    <StyledCard elevation={16}>
                        <div style={{fontSize: 15, textAlign: 'left', width: '100%', marginBottom: '10px'}}>CSCI1000</div>
                        <div style={{fontSize: 25, textAlign: 'left', width: '100%', marginBottom: '10px', color: 'teal', height: '80px', alignContent: 'center'}}>Introduction to Computer Science and Data Science</div>
                        <hr style={{height: '1px', width: '100%', border: 0, marginBottom: '20px', backgroundColor: 'teal'}}/>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', width: '100%'}}>
                            <div style={{textAlign: 'left'}}>
                                <div style={{fontSize: 18, fontWeight: 400, color: 'green'}}>Start</div>
                                <div style={{fontSize: 14}}>10:00</div>
                            </div>
                            <div style={{textAlign: 'right'}}>
                                <div style={{fontSize: 18, fontWeight: 400, color: 'red'}}>Student</div>
                                <div style={{fontSize: 14}}>90</div>
                            </div>
                        </div>
                    </StyledCard>
                    <StyledCard elevation={16}>
                        <div style={{fontSize: 15, textAlign: 'left', width: '100%', marginBottom: '10px'}}>CSCI1000</div>
                        <div style={{fontSize: 25, textAlign: 'left', width: '100%', marginBottom: '10px', color: 'teal', height: '80px', alignContent: 'center'}}>Introduction to Computer Science and Data Science</div>
                        <hr style={{height: '1px', width: '100%', border: 0, marginBottom: '20px', backgroundColor: 'teal'}}/>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', width: '100%'}}>
                            <div style={{textAlign: 'left'}}>
                                <div style={{fontSize: 18, fontWeight: 400, color: 'green'}}>Start</div>
                                <div style={{fontSize: 14}}>10:00</div>
                            </div>
                            <div style={{textAlign: 'right'}}>
                                <div style={{fontSize: 18, fontWeight: 400, color: 'red'}}>Student</div>
                                <div style={{fontSize: 14}}>90</div>
                            </div>
                        </div>
                    </StyledCard>
                </CardBox>
            </InsideContainer>
        </StyledContainer>
    );
};

export default Dashboard;