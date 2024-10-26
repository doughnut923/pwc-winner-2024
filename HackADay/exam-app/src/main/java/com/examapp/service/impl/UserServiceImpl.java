package com.examapp.service.impl;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.examapp.entity.User;
import com.examapp.mapper.UserMapper;
import com.examapp.securityConfig.securityDto.SecurityUser;
import com.examapp.service.UserService;
import com.examapp.utils.JwtUtil;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.Map;


@Service
@Slf4j
public class UserServiceImpl extends ServiceImpl<UserMapper, User>
    implements UserService {
    @Resource
    private UserMapper userMapper;
    @Resource
    private JwtUtil jwtUtil;
    @Resource
    @Lazy
    private AuthenticationManager authenticationManager;


    public User getUserByUsername(@Validated String username) {
        User user = userMapper.getUserByUsername(username);
        return user;
    }
//    public byte[] getImageByUsername(@Validated String username) {
//        try {
//            Map result = userMapper.getImageByUsername(username);
//            return (byte[]) result.get("imageData");
//
//        } catch (Exception e) {
//            throw new RuntimeException(e);
//        }
//    }

//    @Override
//    public int register(User user) {
//        return userMapper.register(user);
//    }

    @Override
    public String authenticate(User user) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(), user.getPassword())
        );
        User retrievedUser = userMapper.getUserByUsername(user.getUsername());
        return jwtUtil.generateToken(new SecurityUser(retrievedUser));
    }
}




