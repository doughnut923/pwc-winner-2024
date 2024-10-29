package com.examapp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.examapp.entity.Exam;
import com.examapp.predefinedConstant.RedisConstant;
import com.examapp.service.ExamService;
import com.examapp.mapper.ExamMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;


@Service
@Slf4j
public class ExamServiceImpl extends ServiceImpl<ExamMapper, Exam>
    implements ExamService{

    @Resource
    private StringRedisTemplate stringRedisTemplate;


    @Override
    public Exam getExamContentAsTeacher(String classname) {
        return handlingExamRetrieval(classname);
    }

    @Override
    public Exam getExamContentAsStudent(String classname, List<String> authorityList) {
        if(!authorityList.contains(classname)){
            return null;
        }

        Exam exam = handlingExamRetrieval(classname);
        Instant now = Instant.now();
        // check if the exam is in time range
        if(now.isAfter(exam.getStartingTime().toInstant()) && now.isBefore(exam.getEndingTime().toInstant())) {
            return exam;
        }

        exam.setContent(null);
        return exam;
    }

    @Override
    public void cacheExamContent(Exam exam) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String examJson = objectMapper.writeValueAsString(exam);
            String key = encodingKey(exam.getClassname());
            Instant storageEndTime = exam.getEndingTime().toInstant().plus(Duration.ofSeconds(RedisConstant.EXAM_STORAGE_DURATION));
            Duration expire = Duration.between(Instant.now(), storageEndTime);
            stringRedisTemplate.opsForValue().set(key, examJson, expire);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }
    protected Exam getExamFromCache(String classname) {
        String key = encodingKey(classname);
        String examJson = stringRedisTemplate.opsForValue().get(key);
        if(examJson == null){
            return null;
        }
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            Exam exam = objectMapper.readValue(examJson, Exam.class);
            return exam;
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }
    private String encodingKey(String classname){
        return RedisConstant.KEY_PREFIX_EXAM  + classname + ":" + RedisConstant.KEY_POSTFIX_EXAM_CONTENT;
    }
    private Exam handlingExamRetrieval(String classname){
        Exam exam = getExamFromCache(classname);
        // if in cache, return from cache
        if (exam != null) {
            return exam;
        }
        log.info("Exam content not in cache");
        // if not in cache, get from sql and update cache
        LambdaQueryWrapper<Exam> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Exam::getClassname, classname);
        exam = getOne(wrapper);
        cacheExamContent(exam);
        return exam;
    }


}




