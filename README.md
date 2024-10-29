# Team Zen1th - Online Exam Cheating Detection
We created a platform for teachers to monitor students in an online exam and check the whether the student is cheating in the exam 

## Running the Application
The application consists of a SQL Database, a Redis Cache, a Springboot Backend and a React Frontend. Which could be simply ran with docker compose.
1. Open the terminal and clone the repository.
```sh
git clone https://github.com/doughnut923/pwc-winner-2024.git
```
2. Install [docker](https://docs.docker.com/get-started/get-docker/). 
3. Run the server.
```sh
docker-compose up -d
```
You may need to add sudo in front of the command if you haven't set up docker user permission group.


## Using the Application

### Registering for a Teacher Account

A teacher account should first be created in order to create and assign the class the the student. once your reach `{your_address}/`, you will be greeted with a login page. Click Sign Up and enter the credentials, click Sign up again. Then you will be prompted to provide face ID, make sure you gave access to the application to access your camera, after aligning the camera to your face, Click done. Then a account would be created.

### Adding a Teacher Role

This application is still in development. To add teacher authority to a user
1. Connect to the SQL Database named `examappdb` with `localhost:3306` with the password and username shown in `compose.yaml` using a method of interest(e.g. [sqlyog](https://github.com/webyog/sqlyog-community/wiki/Downloads))
2. Under the `t_authority` table, change the value of `permission` to `teacher` for the newly create account. Then apply the changes to the database.

### Create student accounts

Create a student account just like creating a teacher account, but without changing the authority group in sql, as new users are defaulted to be students.

### Adddi
