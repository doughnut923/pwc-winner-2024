package com.examapp.mapper;

import com.examapp.entity.Authority;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.util.List;
import java.util.Set;


public interface AuthorityMapper extends BaseMapper<Authority> {


    Set<String> getPermissionByUsername(String username);

    List<String> getStudentListByClassname(String classname);
}




