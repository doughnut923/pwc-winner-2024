package com.examapp.service.impl;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Map;

/**
* @author jkyli
* @description 针对表【t_user】的数据库操作Service实现
* @createDate 2024-10-21 00:21:49
*/
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
    @Resource
    @Lazy
    private PasswordEncoder passwordEncoder;

    public User getUserByUsername(@Validated String username) {
        User user = userMapper.getUserByUsername(username);
        return user;
    }
    public byte[] getImageByUsername(@Validated String username) {
        try {
            Map result = userMapper.getImageByUsername(username);
            return (byte[]) result.get("imageData");

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public User register(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userMapper.register(user);
        return user;
    }

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




