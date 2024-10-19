
import { ThemeContext } from '@emotion/react';
import { Container, TextField, Button, Box, Card } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    // alignItems: 'center',
    minHeight: '100vh',
    minWidth: '100vw',
    backgroundColor: theme.palette.background.default,
}));

const InsideContainer = styled(Container)(({ theme }) => ({
    borderRadius: 0,
    padding: theme.spacing(3),
    marginTop: '100px',
    backgroundColor: theme.palette.background.default,
    minWidth: '240px',
    display: 'block',
    flexDirection: 'column',
    alignItems: 'center',
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

export { StyledContainer, InsideContainer, StyledCard, CardBox };