import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Login from './Login';
import Register from './Register';
import ExamOption from './Pages/ExamOption';
import ExamPage from './ExamPage';
import Complete from './Complete';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "login",
    element: <Login/>,
  },
  {
    path: "signup",
    element: <Register/>,
  },
  {
    path: "exam",
    element : <ExamPage/>
  }
  ,
  {
    path: "exam-option",
    element: <ExamOption/>,
  },
  {
    path: "complete",
    element: <Complete/>,
  }
]);

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, Arial, sans-serif',
  },
  palette: {
    primary: {
      main: '#005249',
    },
    secondary: {
      main: '#97B002',
    },
    background: {
      default: '#EBEDDF',
    },
  },
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
