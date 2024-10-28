package com.examapp.service.impl;

import com.examapp.predefinedConstant.RedisConstant;
import com.examapp.service.AuthorityService;
import com.examapp.service.ExamService;
import com.examapp.service.ExamStatusService;
import com.examapp.utils.ComparingFaces;
import com.examapp.utils.S3Util;
import com.examapp.utils.SecurityContextHolderUtil;
import jakarta.annotation.Resource;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExamStatusServiceImpl implements ExamStatusService {
    @Resource
    private S3Util s3Utils;
    @Resource
    private ComparingFaces comparingFaces;
    @Resource
    private StringRedisTemplate stringRedisTemplate;
    @Resource
    private AuthorityService authorityService;
    @Override
    public boolean checkFaces(byte[] inputImage, String classname) throws Exception {
        String username = SecurityContextHolderUtil.getUsernameFromSecurityContextHolder();
        byte[] retrievedImage = s3Utils.retrieveFromS3(username);
        // check if faces match
        if (!comparingFaces.compareFaces(inputImage, retrievedImage)) {
            String listKey = encodeRedisKeyForSuspiciousImageList(username, classname);// key for storing list of suspicious image according to username and password in redis
//            stringRedisTemplate.multi();
            ListOperations<String, String> listOps = stringRedisTemplate.opsForList();
            String imagePath = encodeImagePath(username,classname); // path for storing individual image in S3
            stringRedisTemplate.opsForList().rightPush(listKey, imagePath);
            stringRedisTemplate.expire(listKey, Duration.ofSeconds(RedisConstant.IMAGE_STORAGE_DURATION));
//            stringRedisTemplate.exec();
            s3Utils.storeInS3(inputImage, imagePath);
            // signal faces not matches
            return false;
        }
        // signal faces matches
        return true;
    }

    public List<Map> getSuspiciousImageList(String classname, String username){
        String listKey= encodeRedisKeyForSuspiciousImageList(username, classname);
        List<String> imagePathList = stringRedisTemplate.opsForList().range(listKey, 0, -1);
        if (imagePathList == null || imagePathList.isEmpty()){
            return List.of();
        }
        List<Map> resultList = new ArrayList<>();
        for (String imagePath : imagePathList){
            byte[] imageFile = s3Utils.retrieveFromS3(imagePath);
            long timestamp = getTimestampFromImagePath(imagePath);
            Map map = new HashMap();
            map.put("imageFile", imageFile);
            map.put("timestamp", timestamp);
            resultList.add(map);
        }
        return resultList;
    }

    @Override
    public List<Map> getSuspiciousStudentList(String classname) {
        List<String> studentList = authorityService.getStudentListByClassname(classname);
        List<Map> resultList = new ArrayList<>();
        for (String student : studentList){
            boolean isSuspicious = hasSuspiciousImages(student, classname);
            Map map = new HashMap();
            map.put("username", student);
            map.put("suspicious", isSuspicious);
            resultList.add(map);
        }
        return resultList;
    }

    private String encodeRedisKeyForSuspiciousImageList(String username, String classname){
        return RedisConstant.KEY_PREFIX_EXAM_DASH_BOARD + classname + ":" + username + ":" + RedisConstant.KEY_POSTFIX_SUSPICIOUS_IMAGES;
    }
    private String encodeImagePath(String username, String classname){
        return encodeRedisKeyForSuspiciousImageList(username, classname) + "_" + Instant.now().toEpochMilli();
    }
    private long getTimestampFromImagePath(String imagePath){
        int timestampIndex = imagePath.lastIndexOf("_");
        return Long.parseLong(imagePath.substring(timestampIndex + 1));
    }
    private boolean hasSuspiciousImages(String username, String classname) {
        String listKey = encodeRedisKeyForSuspiciousImageList(username, classname);
        Long suspiciousImageCount = stringRedisTemplate.opsForList().size(listKey);

        // Return true if there are suspicious images
        return suspiciousImageCount != null && suspiciousImageCount > 0;
    }
}
