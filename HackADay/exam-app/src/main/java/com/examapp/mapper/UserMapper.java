package com.examapp.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.examapp.entity.User;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.sql.Blob;
import java.util.List;
import java.util.Map;


public interface UserMapper extends BaseMapper<User> {
//    Map getImageByUsername(String username);

    User getUserByUsername(String username);

    List<User> getStudentWithClasses(IPage<User> userIPage);

//    int register(User user);
}




