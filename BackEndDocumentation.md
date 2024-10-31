# BackEnd Documentation

## BackEnd
- **Tech stack**: Java Spring Boot + Spring Security + MyBatis-Plus.
- **Documentation**: Detailed descriptions of methods are available in Javadoc.
- **Recommendation**: Check **com.examapp.controllers** in Javadoc for API endpoints open to the frontend. Click here: [https://wondrous-beignet-cd0513.netlify.app/]
- important javadoc:
- Controllers : [file:///Users/michael/Documents/HackADay/HackADay/javadoc/com/examapp/securityConfig/filters/package-summary.html]
  - package info : [https://wondrous-beignet-cd0513.netlify.app/com/examapp/controllers/packageinfo]
  - UserController : [https://wondrous-beignet-cd0513.netlify.app/com/examapp/controllers/usercontroller]
  - AuthorityController : [https://wondrous-beignet-cd0513.netlify.app/com/examapp/controllers/authoritycontroller]
  - ExamController : [https://wondrous-beignet-cd0513.netlify.app/com/examapp/controllers/examcontroller]
  - StatusController : [https://wondrous-beignet-cd0513.netlify.app/com/examapp/controllers/statuscontroller]
  
- Security filters : [https://wondrous-beignet-cd0513.netlify.app/com/examapp/securityconfig/filters/package-summary]
  - ddosFilter : [https://wondrous-beignet-cd0513.netlify.app/com/examapp/securityconfig/filters/ddosfilter]
  - TokenFilter : [https://wondrous-beignet-cd0513.netlify.app/com/examapp/securityconfig/filters/tokenfilter]

## Cloud Architecture
![AWS Cloud](/asset/AWS_Cloud.png)

## Database Design
The application uses MySQL, Redis, and S3 for data storage.

- **MySQL**: Stores permanent data with three tables:
  - **t_user**
  - **t_authority**
  - **t_exam
- **Redis**: Stores temporary data including exam status and caches hotspot data from MySQL.
- **S3**: Handles all image storage.

### MySQL

#### t_user
- **Purpose**: Store user identity.
- **Columns**:
  - `id` (bigint): Primary key stored using the snowflake algorithm.
  - `username` (varchar): Unique name identifying the person (note that ':' is banned in registration).
  - `password` (char): Login password encrypted using bcrypt.

#### t_authority
- **Purpose**: Store user access permissions.
- **Columns**:
  - `id` (bigint): Primary key stored using the snowflake algorithm.
  - `username` (varchar): Same as t_user : username.
  - `permission` (varchar): Stores access control information including:
    - Roles: Teacher/Student.
    - Class enrolled: Classname (exam) the student has access to (e.g., English).

#### t_exam
- **Purpose**: Store exam content and timestamps.
- **Columns**:
  - `classname` (varchar): Unique class name identifying the exam.
  - `starting_time` (timestamp): Starting time for the exam.
  - `ending_time` (timestamp): Ending time for the exam.
  - `content` (text): Exam content in plain text.

### Redis
Redis operates on RAM (Random Access Memory), providing high resistance in high concurrency environments.

**Key Functions**:
- Stores temporary data:
  - Suspicious images sent during exams are stored with the prefix `ExamDashboard` as a list.
    - Example: `examDashBoard: Linear Algebra: Jacky: suspiciousImages: _1730036905301`
    - Path in S3: `examDashBoard: {classname}: {username}: _{timestamp}`
- Stores address for DdosFilter as key and request count as value.
- Stores token expiration time.
- Caches exam content with the prefix `exam`.

### S3
- **Purpose**: Store all images.
- Registered images are stored with the username in the prefix.
- Suspicious images sent during exams are stored with the prefix:
  - `examDashBoard: {classname}: {username}: _{timestamp}`
- Images with the prefix `examDashBoard:` have an expiration time of 30 days (identifier for suspicious images).

## Security Considerations

### Login
- **Double Confirmation**: User validation through both password and facial recognition.
- **Secure Password Storage**: Passwords are hashed using bcrypt for strong resistance against collision attacks.
- **User Identification**: The backend identifies users via secure tokens.
- **Token Management**:
  - Token expiration is managed in Redis.
  - Tokens refresh only upon user access to backend endpoints.
  - This expiration and refresh mechanism reduces the risk of token theft.

### Permission System
- **Roles**: Teacher/Student.
- Every registered account defaults to "student".
- Teacher accounts can only be assigned by the backend.
- Teachers have access to endpoints which students can’t access.
- Teachers have more power and direct access to the SQL database.
- Students are expected to outnumber teachers, so endpoints accessed using a student account are cached (expected no direct access to SQL in normal circumstances).

### Teacher Permission
- **Endpoints**:
  - Assign students to classes (`setAuthorities`).
  - See exam content even not during exam time (`getExamContent`).
  - See suspicious student list and images (`getSuspiciousImageList` and `getSuspiciousList`).

### Student Permission
- **Endpoint Access**: Accesses cached data in RAM, minimizing direct queries to the SQL database.
- **Benefits**:
  - Higher concurrency handling.
  - Reduces the risk of overloading the SQL database (either accidental or malicious attacks).
- **Examples**:
  - `getExamList`: Retrieves class names from `SecurityContextHolder` (stored in thread-local storage in RAM after user login)
  - `getExamContent`: Fetches exam content from Redis (also in RAM)


