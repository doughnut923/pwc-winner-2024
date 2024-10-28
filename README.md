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

## Adding a Teacher Role
To access the `assign-class` page correctly, you need to have the teacher authority your registered account.
1. Connect to the SQL Database named `examappdb` with `localhost:3306` with the password and username shown in `compose.yaml` using a method of interest(e.g. [sqlyog](https://github.com/webyog/sqlyog-community/wiki/Downloads))
2. Under the `t_authority` table, change the value of `permission` to teacher in the corresponding user's row
