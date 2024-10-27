package com.examapp.service;

import com.examapp.entity.Authority;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;


public interface AuthorityService extends IService<Authority> {


    boolean insertAuthorityWithChecking(List<Authority> authorityList);

    String checkTeacherOrStudentByUsername(String username);
}
