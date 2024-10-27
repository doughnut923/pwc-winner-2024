package com.examapp.service;

import com.examapp.entity.User;
import com.baomidou.mybatisplus.extension.service.IService;
import org.springframework.validation.annotation.Validated;


public interface UserService extends IService<User> {
    public User getUserByUsername(@Validated String name);

//    int register(User user);

    String authenticate(User user);

//    byte[] getImageByUsername(@Validated String name);
}
