package com.examapp.mapper;

import com.examapp.entity.User;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.sql.Blob;
import java.util.Map;


public interface UserMapper extends BaseMapper<User> {
//    Map getImageByUsername(String username);

    User getUserByUsername(String username);

//    int register(User user);
}




