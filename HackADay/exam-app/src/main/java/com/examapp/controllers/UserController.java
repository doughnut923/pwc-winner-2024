package com.examapp.controllers;



import com.examapp.entity.Authority;
import com.examapp.entity.User;
import com.examapp.predefinedConstant.AuthorityConstants;
import com.examapp.service.AuthorityService;
import com.examapp.service.UserService;
import com.examapp.utils.ComparingFaces;
import com.examapp.utils.JwtUtil;
import com.examapp.utils.S3Utils;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.aop.framework.AopContext;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


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
    private JwtUtil jwtUtil;
    @Resource
    private ComparingFaces comparingFaces;
    @Resource
    private ObjectMapper objectMapper;
    @Resource
    @Lazy
    private PasswordEncoder passwordEncoder;
    @Resource
    private S3Utils s3Utils;


    @PostMapping(value = "/login", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<String> login(
            @RequestParam("imageFile") MultipartFile imageFile,
            @RequestPart("user") String  userJson
    ) throws Exception {
        if (imageFile.isEmpty()) {
            return ResponseEntity.badRequest().body("Photo needed.");
        }

        // prepare user object
        User user = objectMapper.readValue(userJson, User.class);
        // image is store in s3 as username (which is unique)
        byte[] retrievedImage = s3Utils.retrieveFromS3(user.getUsername());


        // check if faces match
        if (!comparingFaces.compareFaces(imageFile.getBytes(), retrievedImage)) {
            return ResponseEntity.status(HttpServletResponse.SC_FORBIDDEN).build();
        }
        String token = userService.authenticate(user);
        return ResponseEntity.ok(token);
    }
    /**
     * Registers a new user with an uploaded image.
     *
     * @param imageFile the image file uploaded by the user (required)
     * @param userJson  the user details in JSON format (required)
     * @return ResponseEntity with the registration status and message
     * @throws Exception if there is an error processing the registration
     *
     * Expected Status Codes:
     * - 201 Created: User registered successfully
     * - 400 Bad Request: If the image file is missing
     * - 409 Conflict: If the username already exists
     */
    @PostMapping(value = "/register", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Void> register(
            @RequestParam("imageFile") MultipartFile imageFile,
            @RequestPart("user") String  userJson
    ) throws Exception{

        if (imageFile.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        User user = objectMapper.readValue(userJson, User.class);
        s3Utils.storeInS3(imageFile.getBytes(), user.getUsername());
        /*
         synchronized according to username
         prevent racing of multiple user with same username
         user proxy to avoid self invoke of transactional
         */
        synchronized (user.getUsername().intern()){
            UserController proxy =
                    (UserController) AopContext.currentProxy();
            ;
            if (proxy.handleRegister(user)) {
                return ResponseEntity.ok(null);
            }else {
                return ResponseEntity.status(HttpServletResponse.SC_CONFLICT).build();
            }
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

}
