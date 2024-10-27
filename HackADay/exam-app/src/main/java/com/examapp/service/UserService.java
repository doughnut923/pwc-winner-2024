package com.examapp.service;

import com.examapp.entity.User;
import com.baomidou.mybatisplus.extension.service.IService;
import org.springframework.validation.annotation.Validated;

import java.util.List;


public interface UserService extends IService<User> {
    public User getUserByUsername(@Validated String name);

    String authenticate(User user);

    List<User> getStudentWithClasses(int pageNum, int pageSize);

}
