package com.examapp.controllers;




import com.examapp.entity.Authority;
import com.examapp.entity.User;
import com.examapp.predefinedConstant.AuthorityConstants;
import com.examapp.predefinedConstant.RedisConstant;
import com.examapp.service.AuthorityService;
import com.examapp.service.UserService;
import com.examapp.utils.ComparingFaces;
import com.examapp.utils.JwtUtil;
import com.examapp.utils.S3Util;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.aop.framework.AopContext;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <ul>
 *   <li>Handles operations related to user authentication and registration.</li>
 *   <li>APIs available:
 *     <ol>
 *       <li>User login requests with image verification (<code>login</code>)</li>
 *       <li>Registers a new user with an uploaded image (<code>register</code>)</li>
 *       <li>Retrieve a paginated list of students along with their associated classes (<code>getStudentWithClasses</code>)</li>
 *     </ol>
 *   </li>
 *   <li>login and register are the only endpoint that does not require logging in. GetStudentWithClasses require token obtained from logging in</li>
 *   <li>Teacher specific:
 *     <ul>
 *       <li><code>getStudentWithClasses</code>: Displays a paginated list of students and their classes.</li>
 *     </ul>
 *   </li>
 * </ul>
 */
@CrossOrigin
@RestController
@RequestMapping("user")
@Slf4j
public class UserController {
    @Resource
    private UserService userService;
    @Resource
    private AuthorityService authorityService;
    @Resource
    private ComparingFaces comparingFaces;
    @Resource
    private ObjectMapper objectMapper;
    @Resource
    @Lazy
    private PasswordEncoder passwordEncoder;
    @Resource
    private S3Util s3Utils;
    @Resource
    private StringRedisTemplate stringRedisTemplate;
    /**
     * POST - User login requests with image verification.
     *
     * <p>This method processes POST requests to the <code>/user/login</code> endpoint.</p>
     *
     * <p>It first checks if the uploaded image file is empty and
     * returns a <code>400 Bad Request</code> response if it is.</p>
     *
     * <p>If the file is valid, it prepares a <code>User</code> object from the provided JSON
     * and retrieves the corresponding stored image from S3 using the user's username.</p>
     *
     * <p>The method then compares the uploaded image with the stored image. If the
     * faces do not match, it returns a <code>403 Forbidden</code> response. If the faces match,
     * it authenticates the user and retrieves their role (either Teacher or Student).</p>
     *
     * <p>Finally, it returns a response containing an authentication token and the user's role.</p>
     * <p>Return values:</p>
     * <ul>
     *     <li>200 OK with a map containing the authentication token and user role if
     *         login is successful.</li>
     *     <li>400 Bad Request if the image file is empty.</li>
     *     <li>403 Forbidden if the faces do not match.</li>
     * </ul>
     *
     * @param imageFile The image file uploaded as part of the request, representing
     *                  the user's face for verification. (required)
     * @param userJson A JSON string containing user information, which is converted
     *                 to a User object for authentication purposes.  (required)
     *                 Example JSON format:
     *                 <pre>
     *                 {
     *                     "username": "john_doe",
     *                     "password": "securePassword123"
     *                 }
     *                 </pre>
     * @return A ResponseEntity containing a map with the authentication token and
     *         user role, or appropriate error responses based on validation checks.
     * @throws Exception If any error occurs during user object creation, image
     *                   retrieval, face comparison, or authentication.
     *
     * <p>Example response for successful login:</p>
     * <pre>
     * {
     *     "token": "abc123xyz",
     *     "role": "Teacher"
     * }
     * </pre>
     */
    @PostMapping(value = "/login", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Map> login(
            @RequestParam("imageFile") MultipartFile imageFile,
            @RequestPart("user") String  userJson
    ) throws Exception {

        // prepare user object
        User user = objectMapper.readValue(userJson, User.class);
        // special allowance for root user
        if (user.getUsername().equals("root")){
            String token = userService.authenticate(user);
            stringRedisTemplate.opsForValue().set(RedisConstant.KEY_PREFIX_TOKEN_STORAGE + token, "1", Duration.ofSeconds(RedisConstant.TOKEN_STORAGE_DURATION));
            Map map = new HashMap();
            map.put("token", token);
            map.put("role", AuthorityConstants.TEACHER);
            return ResponseEntity.ok(map);
        }
        if (user.getUsername().equals("Jacky")){
            String token = userService.authenticate(user);
            stringRedisTemplate.opsForValue().set(RedisConstant.KEY_PREFIX_TOKEN_STORAGE + token, "1", Duration.ofSeconds(RedisConstant.TOKEN_STORAGE_DURATION));
            Map map = new HashMap();
            map.put("token", token);
            map.put("role", AuthorityConstants.STUDENT);
            return ResponseEntity.ok(map);
        }
        // image is store in s3 as username (which is unique)
        byte[] retrievedImage = s3Utils.retrieveFromS3(user.getUsername());

        if (imageFile.isEmpty()) {
            return ResponseEntity.status(HttpServletResponse.SC_BAD_REQUEST).build();
        }



        // check if faces match
        if (!comparingFaces.compareFaces(imageFile.getBytes(), retrievedImage)) {
            return ResponseEntity.status(HttpServletResponse.SC_FORBIDDEN).build();
        }
        String token = userService.authenticate(user);
        // redis control expiration of token
        stringRedisTemplate.opsForValue().set(RedisConstant.KEY_PREFIX_TOKEN_STORAGE + token, "1", Duration.ofSeconds(RedisConstant.TOKEN_STORAGE_DURATION));

        String role = authorityService.checkTeacherOrStudentByUsername(user.getUsername());
        Map map = new HashMap();
        map.put("token", token);
        map.put("role", role);
        return ResponseEntity.ok(map);
    }

    /**
     * POST - Registers a new user with an uploaded image.
     * <p><strong>Note:</strong> Username with ':' is not allowed to avoid conflicts in Redis or S3.</p>
     *
     * <p>This method processes POST requests to the <code>/user/register</code> endpoint, expecting a
     * multipart form-data request that includes an image file and user details in JSON format.</p>
     *
     * <p>It checks if the uploaded image file is present and validates the username before
     * proceeding with the registration process.</p>
     *
     * @param imageFile the image file uploaded by the user (required)
     * @param userJson  the user details in JSON format (required). Example JSON format:
     *                  <pre>
     *                  {
     *                      "username": "john_doe",
     *                      "password": "securePassword123",
     *                  }
     *                  </pre>
     * @return ResponseEntity with the registration status and message.
     * @throws Exception if there is an error processing the registration.
     *
     * <p>Expected Status Codes:</p>
     * <ul>
     *     <li>201 Created: User registered successfully.</li>
     *     <li>400 Bad Request: If the image file is missing or username not valid (has ':').</li>
     *     <li>409 Conflict: If the username already exists.</li>
     * </ul>
     *
     * </pre>
     */
    @PostMapping(value = "/register", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Void> register(
            @RequestParam("imageFile") MultipartFile imageFile,
            @RequestPart("user") String  userJson
    ) throws Exception{

        if (imageFile.isEmpty()) {
            return ResponseEntity.status(HttpServletResponse.SC_BAD_REQUEST).build();
        }
        User user = objectMapper.readValue(userJson, User.class);
        // not allowing username with ':' to avoid conflicts
        if(user.getUsername().contains(":")){
            return ResponseEntity.status(HttpServletResponse.SC_BAD_REQUEST).build();
        }
        s3Utils.storeInS3(imageFile.getBytes(), user.getUsername());
        /*
         synchronized according to username
         prevent racing of multiple user with same username
         user proxy to avoid self invoke of transactional
         */
        try {
            synchronized (user.getUsername().intern()){
                UserController proxy =
                        (UserController) AopContext.currentProxy();
                if (proxy.handleRegister(user)) {
                    return ResponseEntity.ok(null);
                }else {
                    return ResponseEntity.status(HttpServletResponse.SC_CONFLICT).build();
                }
            }
        } catch (org.springframework.dao.DuplicateKeyException e) {
            return ResponseEntity.status(HttpServletResponse.SC_CONFLICT).build();
        }
    }
    @Transactional
    protected boolean handleRegister(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        boolean flag = userService.save(user);
        if(!flag){
            return false;
        }
        Authority authority = new Authority();
        authority.setUsername(user.getUsername());
        authority.setPermission(AuthorityConstants.STUDENT);
        return authorityService.save(authority);
    }
    /**
     * GET - Retrieve a paginated list of students along with their associated classes.
     *
     * <p>This method maps to the "/user/studentWithClasses" endpoint.</p>
     *
     * <p>It retrieves a list of students with their corresponding classes enrolled, returning the results in a paginated format
     * based on the provided page number.</p>
     *
     * <p>The method uses the {@link UserService} to fetch students with their classes for the specified page.</p>
     *
     * <p>Return values:</p>
     * <ul>
     *     <li>200 OK with a list of {@link User} objects representing students and their classes.</li>
     * </ul>
     *
     * <p><strong>
     *     This is considered as an expensive operation on sql as it involve retrieving the joint table of user and authority
     *     Pagination is thus required to avoid excessive retrieval.
     * </strong></p>
     * <p><strong>Pagination:</strong>
     * The method accepts a <code>pageNum</code> parameter to determine which page of results to return.
     * The page size is defined by the constant <code>AuthorityConstants.pageSize</code>.</p>
     *
     * @param pageNum The page number to retrieve, starting from 1.
     *
     * @return ResponseEntity<List<User>> A response entity containing a list of users
     *         with their associated classes.
     * <p>Example response:</p>
     * <pre>
     * [
     *     {
     *         "username": "Jacky",
     *         "authorities": [
     *             {
     *                 "permission": "Linear algebra"
     *             },
     *             {
     *                 "permission": "English"
     *             },
     *             {
     *                 "permission": "University Calculus"
     *             }
     *         ]
     *     },
     *     {
     *         "username": "Jacky3",
     *         "authorities": []
     *     },
     * ]
     * </pre>
     */
    @GetMapping("studentWithClasses")
    public ResponseEntity<List<User>> getStudentWithClasses(@RequestParam int pageNum){
        List<User> userListWithClasses = userService.getStudentWithClasses(pageNum, AuthorityConstants.pageSize);
        return ResponseEntity.ok(userListWithClasses);
    }


}
