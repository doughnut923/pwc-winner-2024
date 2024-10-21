package com.examapp.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.examapp.entity.Authority;
import com.examapp.service.AuthorityService;
import com.examapp.mapper.AuthorityMapper;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/**
* @author jkyli
* @description 针对表【t_authority】的数据库操作Service实现
* @createDate 2024-10-21 00:21:44
*/
@Service
public class AuthorityServiceImpl extends ServiceImpl<AuthorityMapper, Authority>
    implements AuthorityService{
    @Resource
    private AuthorityMapper authorityMapper;

}




