package com.examapp.service.impl;

import com.examapp.predefinedConstant.RedisConstant;
import com.examapp.service.ExamStatusService;
import com.examapp.utils.ComparingFaces;
import com.examapp.utils.S3Util;
import com.examapp.utils.SecurityContextHolderUtil;
import jakarta.annotation.Resource;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class ExamStatusServiceImpl implements ExamStatusService {
    @Resource
    private S3Util s3Utils;
    @Resource
    private ComparingFaces comparingFaces;
    @Resource
    private StringRedisTemplate stringRedisTemplate;
    @Override
    public boolean checkFaces(byte[] inputImage) throws Exception {
        String username = SecurityContextHolderUtil.getUsernameFromSecurityContextHolder();
        byte[] retrievedImage = s3Utils.retrieveFromS3(username);
        // check if faces match
        if (!comparingFaces.compareFaces(inputImage, retrievedImage)) {
            String listKey = RedisConstant.KEY_PREFIX_SUSPICIOUS_IMAGES + username; // key for storing list of suspicious image in redis
            stringRedisTemplate.multi();
            ListOperations<String, String> listOps = stringRedisTemplate.opsForList();
            long count = listOps.size(listKey);
            String imageKey = listKey + count; // key for storing individual image in S3
            stringRedisTemplate.opsForList().rightPush(listKey, imageKey);
            stringRedisTemplate.expire(listKey, Duration.ofSeconds(RedisConstant.IMAGE_STORAGE_DURATION));
            stringRedisTemplate.exec();
            s3Utils.storeInS3(inputImage, imageKey);
            // signal faces not matches
            return false;
        }
        // signal faces matches
        return true;
    }
}
