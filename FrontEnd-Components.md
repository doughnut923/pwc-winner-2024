# FrontEnd Components
We separated the components into two segments: `Components` and `Pages`. For your information, `class` is an `exam`. We will be using those two terms interchangeably.


## Components Folder

### AssignClassSelector.js
The `AssignClassSelector` component allows assigning a class to a student by fetching available classes and displaying them in a list.

### BiometricLogin.js
The purpose of the `BiometricLogin` component is to display the webcam, presented by the `ShowWebcam` component, that will be used for face recognition in the login page. This component accesses the user's webcam. This component's functionality (checking faces, etc.) will be implemented by the parent component.

### BiometricSetup.js
The purpose of the `BiometricLogin` component is to display the webcam, presented by the `ShowWebcam` component, that will be used for face recognition in the register page. This component accesses the user's webcam. This component's functionality (checking faces, etc.) will be implemented by the parent component.

### CheckCamera.js
The `CheckCamera` component sets up and displays a webcam feed for users to ensure their camera is correctly positioned. This component includes a visual setup guide and integrates the `ShowWebcam` component to handle webcam interaction.

### MyTableRow.js
The `MyTableRow` component displays a student's information in a table row, including their classes and an option to assign new classes, which is presented by the `AssignClassSelector` component. 
<br /><br />
**Note:**This component is accessible to teachers only.

### Question.js
The `Question` component displays exam questions, and integrates webcam functionality to snap and send images periodically.
**Key Features:**
- Question Navigation: Users can navigate through questions using "Previous" and "Next" buttons.
- Answer Selection: Users select answers via radio buttons, which are stored and managed in the state.
- Timer: A countdown timer displays the remaining exam time.
- Webcam Integration: Periodically captures and sends images to the backend for monitoring purposes.

<br />
**Note:** This component is accessible to students only.

### ShowWebcam.js
The `ShowWebcam` component initializes and displays a webcam feed, and captures a snapshot upon user request.


## Pages Folder

### ./Students/StudentExamOption.js
The purpose of this page is to display the list of exams a student can take (in the form of cards).  Each card contains the exam name, start time, and end time. The student can select an exam to begin doing it.
<br/><br/>
**Note:** This page is accessible to teachers only.

### ./Teachers/AssignClass.js
The purpose of this page is to display the list of students and their classes. The teacher can add students to another class in this page.
<br/><br/>
**Note:** This page is accessible to teachers only.

### ./Teachers/CreateClass.js
This page allows teachers to create a class (exam) with functionalities as follow:
- Create a name for the class (exam)
- Set the start and end time of the class
- Input the questions
<br/>

**Note:** This page is accessible to teachers only. Non-teacher roles may access this page, but won't be able to receive any data.

### ./Teachers/ExamDashboard.js
This page displays the countdown timer for the exam and list of exam takers that can take the exam/class and allows teachers to see suspicious images detected by the webcam of each exam takers in the form of carousel.
<br/><br/>
**Note:** This page is accessible to teachers only.

### ./Teachers/TeacherExamOption.js
The purpose of this page is to display the list of all exams.  Each card contains the exam name, start time, and end time. The teacher can click a card to enter the `ExamDashboard.js` page of each exam. When the teacher navigates to the `ExamDashboard.js` page, the examName will be stored in the local storage to be used to fetch the exam details from the backend.
<br/><br/>
**Note:** This page is accessible to teachers only.

### Complete.js
This page will be shown to the exam taker's screen when the time of the exam is up.

### ExamPage.js
This page is shown to the exam taker's screen when he/she clicked the card in the `ExamList.js` page. He/she will first be led to a page where he/she can check their webcam's position. Then, he/she will be led to a countdown page to wait for the exam to start. Afterwards, he/she will be led to the `Question.js` component to complete the exam.
<br/><br/>
**Note:** This page is accessible to students only. Non-student role will see an error when trying to access this page as they don't have sufficient data, stored in the local storage (examName), to access this page.

### Login.js
This page is the login page for both teachers and students. It will check the username, password, and face of the user and redirect them to the corresponding page (students will be directed to the student's exam dashboard, teachers will be directed to the teacher's exam dashboard).
<br />
After the user registers successfully, their assigned role and token will be stored in the local storage.

### Register.js
This page allows new users to register an account, where they will be asked to make a new username, password, and register their faces for the usage of face ID authentication. After they register successfully, they will be directed to the login page to sign in.



