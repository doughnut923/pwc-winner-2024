package com.examapp.service;

import com.examapp.entity.User;
import com.baomidou.mybatisplus.extension.service.IService;
import org.springframework.validation.annotation.Validated;

/**
* @author jkyli
* @description 针对表【t_user】的数据库操作Service
* @createDate 2024-10-21 00:21:49
*/
public interface UserService extends IService<User> {
    public User getUserByUsername(@Validated String name);

    User register(User user);

    String authenticate(User user);

    byte[] getImageByUsername(@Validated String name);
}
