
import { ThemeContext } from '@emotion/react';
import { Container, TextField, Button, Box, Card } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100vh',
    minWidth: '100vw',
    backgroundColor: theme.palette.background.default,
}));

const InsideContainer = styled(Container)(({ theme }) => ({
    borderRadius: 20,
    margin: '30px',
    width: '100vw',
    backgroundColor: 'white',
    fontSize: 45,
    fontWeight: 300,
}));

const CardBox = styled(Container)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '40px',
    padding: 0,
    marginLeft: 'auto',
    marginRight: 'auto'
}));

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: 10,
    padding: theme.spacing(3),
    width: '200px',
    height: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: 10,
    transition: 'background-color 0.3s, transform 0.3s', // Smooth transition for hover effects

    // Hover styles
    '&:hover': {
        transform: 'scale(1.05)', // Slightly enlarge on hover
    },
}));

const ControlPanel = styled(Card)(({ theme }) => ({
    
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    width: '100%', // Make the text field span the entire container
    '& .MuiOutlinedInput-root': {
        borderRadius: 20, // Set border radius
        fontSize: '12px', // Set text size to 12px
        padding: '10px', // Ensure padding is consistent
    },
    '& .MuiInputLabel-root': {
        fontSize: '12px', // Set label text size to 12px
    },
    '& .MuiInputBase-input': {
        padding: '5px', // Set padding to ensure text alignment
    },
    marginBottom: theme.spacing(1), // Reduce the margin-bottom for the first TextField
}));



export { StyledContainer, InsideContainer, ControlPanel, StyledTextField, StyledCard, CardBox };