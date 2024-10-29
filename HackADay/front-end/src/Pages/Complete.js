
import { Typography, Box, Grow } from '@mui/material';
import logo from "../logo.svg"; // Adjust the path to your logo image
import { useNavigate } from 'react-router-dom';
import { StyledContainer, StyledCard, StyledButton } from "./LoginStyledElements"
import ConfettiExplosion from 'react-confetti-explosion';
import useState from 'react';


const Complete = () => {

    const navigate = useNavigate();

    const returnToMenu = () => {
        if (localStorage.getItem("role") === 'teacher') {
            navigate("/teacher-exam-option");
        } else {
            navigate("/student-exam-option");
        }
    }

    return (
        <>
            <StyledContainer maxWidth="sm">
                <>
                    <ConfettiExplosion style={{ position: "absolute" }} />
                </>
                <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                    <img src={logo} alt="Logo" style={{ maxWidth: '150px' }} />
                </Box>
                <Grow in={true}>
                    <StyledCard elevation={16}>
                        <Typography pl="4px" component="h3" variant="h5" align="center" color='primary' sx={{ fontWeight: 600 }}>
                            Completed!
                        </Typography>
                        <Typography pl="4px" component="h1" variant="h1" align="center" color='primary' sx={{ fontWeight: 600, marginTop: "30px" }}>
                            ⭐
                        </Typography>
                        <StyledButton variant='contained' onClick={returnToMenu}>
                            Return to menu
                        </StyledButton>
                    </StyledCard>
                </Grow>
            </StyledContainer>
        </>
    );
};

export default Complete;