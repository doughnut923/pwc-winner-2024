import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ExamOption from './Pages/ExamOption';

import ExamDashboard from './Pages/Teachers/ExamDashboard';
// import ExamPage from './ExamPage';
// import Complete from './Complete';

import ExamPage from './Pages/ExamPage';
import Complete from './Pages/Complete';
import AssignClass from './Pages/Teachers/AssignClass'; 
import StudentExamOption from './Pages/Students/StudentExamOption';
import TeacherExamOption from './Pages/Teachers/TeacherExamOption';
import CreateClass from './Pages/Teachers/CreateClass';


const router = createBrowserRouter([
  {
    path: "/",
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
    path: "teacher-exam-option",
    element: <TeacherExamOption/>,
  },
  {
    path: "student-exam-option",
    element: <StudentExamOption/>,
  },
  {
    path: "exam-dashboard",
    element: <ExamDashboard/>,
  },
  {
    path: "complete",
    element: <Complete/>,
  },
  {
    path: "assign-class",
    element: <AssignClass/>,
  },
  {
    path: "create-class",
    element: <CreateClass/>,
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
