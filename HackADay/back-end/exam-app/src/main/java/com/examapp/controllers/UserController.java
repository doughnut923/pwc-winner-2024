package com.examapp.controllers;

import com.examapp.dto.UserDto;
import com.examapp.entity.Authority;
import com.examapp.entity.User;
import com.examapp.securityConfig.securityDto.SecurityUser;
import com.examapp.service.AuthorityService;
import com.examapp.service.UserService;
import com.examapp.utils.CompareFaces;
import com.examapp.utils.JwtUtil;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.aop.framework.AopContext;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

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
    private CompareFaces compareFaces;
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserDto userDto) throws Exception {
        User user = new User(userDto);
        if (!compareFaces.compareFaces(user)) {
            return ResponseEntity.status(HttpServletResponse.SC_FORBIDDEN).build();
        }
        log.info("passed");
        String token = userService.authenticate(user);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDto userDto) {
        User user = new User(userDto);
        synchronized (user.getUsername().intern()){
            UserController proxy =
                    (UserController) AopContext.currentProxy();
            return ResponseEntity.ok(proxy.handleRegister(user));
        }
    }
    @Transactional
    protected String handleRegister(User user){
        User retrievedUser = userService.register(user);
        Authority authority = new Authority();
        authority.setUsername(retrievedUser.getUsername());
        authority.setAuthority("student");
        authorityService.save(authority);
        return jwtUtil.generateToken(new SecurityUser(retrievedUser));
    }

}
