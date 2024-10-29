package com.examapp.predefinedConstant;

public class RedisConstant {
    public static final String KEY_PREFIX_EXAM_DASH_BOARD = "examDashBoard:";
    public static final String KEY_POSTFIX_SUSPICIOUS_IMAGES = "suspiciousImages:";
    public static final long EXAM_STORAGE_DURATION = 7 * 24 * 3600; // duration for the exam content to be stored after exam ended: 7 days
    public static final String KEY_PREFIX_REMOTE_ADDRESS = "remoteAddress:";
    public static final String KEY_PREFIX_TOKEN_STORAGE = "user:tokenStorage:";
    public static final long TOKEN_STORAGE_DURATION = 3600; // 1 hour expiration for token
    public static final String KEY_PREFIX_EXAM = "exam:";
    public static final String KEY_POSTFIX_EXAM_CONTENT = "examContent:";
    public static final Long MAXREQUESTS = 100L;
}
