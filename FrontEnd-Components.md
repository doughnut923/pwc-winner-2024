# Components Folder
### AssignClassSelector.js
The `AssignClassSelector` component allows assigning a class to a student by fetching available classes and displaying them in a list.
### BiometricLogin.js
The purpose of the `BiometricLogin` component is to display the webcam, presented by the `ShowWebcam` component, that will be used for face recognition in the login page. This component accesses the user's webcam. This component's functionality (checking faces, etc.) will be implemented by the parent component.
### BiometricSetup.js
The purpose of the `BiometricLogin` component is to display the webcam, presented by the `ShowWebcam` component, that will be used for face recognition in the register page. This component accesses the user's webcam. This component's functionality (checking faces, etc.) will be implemented by the parent component.
### CheckCamera.js
The `CheckCamera` component sets up and displays a webcam feed for users to ensure their camera is correctly positioned. This component includes a visual setup guide and integrates the `ShowWebcam` component to handle webcam interaction.
### MyTableRow.js
The `MyTableRow` component displays a student's information in a table row, including their classes and an option to assign new classes, which is presented by the `AssignClassSelector` component. <br /><br />
This component is accessible to teachers only.
### Question.js
The `Question` component manages and displays exam questions, handles user answers, and integrates webcam functionality to snap and send images periodically.
**Key Features:**
- Question Navigation: Users can navigate through questions using "Previous" and "Next" buttons.
- Answer Selection: Users select answers via radio buttons, which are stored and managed in the state.
- Timer: A countdown timer displays the remaining exam time.
- Webcam Integration: Periodically captures and sends images to the backend for monitoring purposes.<br />
<br />

This component is accessible to students only.
### ShowWebcam.js
The `ShowWebcam` component initializes and displays a webcam feed, and captures a snapshot upon user request.