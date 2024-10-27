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


@Service
public class ExamServiceImpl extends ServiceImpl<ExamMapper, Exam>
    implements ExamService{


    @Override
    public Exam getExamContentAsTeacher(String classname) {
        LambdaQueryWrapper<Exam> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Exam::getClassname, classname);
        Exam exam = getOne(wrapper);
        return exam;
    }

    @Override
    @Transactional
    public Exam getExamContentAsStudent(String classname, List<String> authorityList) {
        if(!authorityList.contains(classname)){
            return null;
        }
        
        LambdaQueryWrapper<Exam> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Exam::getClassname, classname);
        Exam exam = getOne(wrapper);
        Instant now = Instant.now();
        // check if the exam is in time range
        if(now.isAfter(exam.getStartingTime().toInstant()) && now.isBefore(exam.getEndingTime().toInstant())) {
            return exam;
        }
        return null;
    }


}




