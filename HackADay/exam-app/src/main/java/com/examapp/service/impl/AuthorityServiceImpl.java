package com.examapp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.examapp.entity.Authority;
import com.examapp.entity.Exam;
import com.examapp.mapper.ExamMapper;
import com.examapp.service.AuthorityService;
import com.examapp.mapper.AuthorityMapper;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.examapp.predefinedConstant.AuthorityConstants.STUDENT;
import static com.examapp.predefinedConstant.AuthorityConstants.TEACHER;


@Service
public class AuthorityServiceImpl extends ServiceImpl<AuthorityMapper, Authority>
    implements AuthorityService{
    @Resource
    private AuthorityMapper authorityMapper;
    @Resource
    private ExamMapper examMapper;

    @Override
    @Transactional
    public boolean insertAuthorityWithChecking(List<Authority> authorityList) {
        Set<String> authoritySet = authorityList.stream().map(Authority::getPermission).collect(Collectors.toSet());
        LambdaQueryWrapper<Exam> wrapper = new LambdaQueryWrapper<>();
        wrapper.in(Exam::getClassname, authoritySet).select(Exam::getClassname);

        List<Exam> validTargetList =  examMapper.selectList(wrapper);
        if(validTargetList == null || validTargetList.isEmpty()){
            return false;
        }
        Set<String> validTargetSet = validTargetList.stream().map(Exam::getClassname).collect(Collectors.toSet());
        List<String> nameList = authorityList.stream().map(Authority::getPermission).toList();
        if( !validTargetSet.containsAll(nameList)) {
            return false;
        }
        saveBatch(authorityList);
        return true;
    }

    @Override
    public String checkTeacherOrStudentByUsername(String username) {
        Set<String> permissionList = authorityMapper.getPermissionByUsername(username);
        if(permissionList.contains(TEACHER)){
            return TEACHER;
        }
        return STUDENT;
    }

    @Override
    public List<String> getStudentListByClassname(String className) {
        return authorityMapper.getStudentListByClassname(className);
    }
}




