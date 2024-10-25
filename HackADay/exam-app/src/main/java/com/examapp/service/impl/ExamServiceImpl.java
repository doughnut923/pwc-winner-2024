package com.examapp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.examapp.entity.Exam;
import com.examapp.service.ExamService;
import com.examapp.mapper.ExamMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

/**
* @author jkyli
* @description 针对表【t_exam】的数据库操作Service实现
* @createDate 2024-10-24 23:48:04
*/
@Service
public class ExamServiceImpl extends ServiceImpl<ExamMapper, Exam>
    implements ExamService{


    @Override
    public Exam getExamContentAsTeacher(String className) {
        LambdaQueryWrapper<Exam> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Exam::getClassname, className);
        Exam exam = getOne(wrapper);
        return exam;
    }

    @Override
    @Transactional
    public Exam getExamContentAsStudent(String className, List<String> authorityList) {
        if(!authorityList.contains(className)){
            return null;
        }
        LambdaQueryWrapper<Exam> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Exam::getClassname, className);
        Exam exam = getOne(wrapper);
        Instant now = Instant.now();
        // check if the exam is in time range
        if(now.isBefore(exam.getStartingTime().toInstant()) && now.isAfter(exam.getEndingTime().toInstant())) {
            return exam;
        }
        return null;
    }


}




