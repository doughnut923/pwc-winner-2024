
import { Container, TextField, Button, Box, Card } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    minWidth: '100vw',
    backgroundColor: theme.palette.background.default,
}));

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: 40,
    padding: theme.spacing(3),
    minWidth: '240px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));


const FormContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
}));

const StyledForm = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
}));

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    padding: "5px 10px",
    borderRadius: 20, // Increase border radius
    width: 'fit-content', // Width to fit content
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


export {StyledForm,FormContainer, StyledContainer, StyledCard, StyledButton, StyledTextField };