package com.examapp.mapper;

import com.examapp.entity.User;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.sql.Blob;
import java.util.Map;

/**
* @author jkyli
* @description 针对表【t_user】的数据库操作Mapper
* @createDate 2024-10-21 00:21:49
* @Entity com.examapp.entity.User
*/
public interface UserMapper extends BaseMapper<User> {
//    Map getImageByUsername(String username);

    User getUserByUsername(String username);

//    int register(User user);
}




